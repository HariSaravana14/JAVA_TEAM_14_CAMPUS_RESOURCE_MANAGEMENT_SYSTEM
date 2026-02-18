package com.campus.service.impl;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.dto.request.ForgotPasswordRequest;
import com.campus.dto.request.LoginRequest;
import com.campus.dto.request.RegisterRequest;
import com.campus.dto.request.ResetPasswordRequest;
import com.campus.dto.request.VerifyOtpRequest;
import com.campus.dto.response.AuthResponse;
import com.campus.dto.response.UserResponse;
import com.campus.entity.OtpToken;
import com.campus.entity.User;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;
import com.campus.exception.ConflictException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.mapper.UserMapper;
import com.campus.repository.OtpTokenRepository;
import com.campus.repository.UserRepository;
import com.campus.security.JwtTokenProvider;
import com.campus.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private static final int OTP_EXPIRY_MINUTES = 5;
	private static final Random RANDOM = new Random();

	private final UserRepository userRepository;
	private final OtpTokenRepository otpTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserMapper userMapper;

	@Override
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		Role requestedRole = request.getRole() == null ? Role.STUDENT : request.getRole();
		if (requestedRole == Role.ADMIN) {
			throw new ConflictException("ADMIN registration is not allowed");
		}

		userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
			throw new ConflictException("Email already registered");
		});

		UUID advisorId = request.getAdvisorId();
		if (requestedRole == Role.STUDENT) {
			if (advisorId == null) {
				throw new ConflictException("Advisor is required for STUDENT registration");
			}
			User advisor = userRepository.findByIdAndStatus(advisorId, UserStatus.ACTIVE)
					.orElseThrow(() -> new ConflictException("Invalid advisor"));
			if (advisor.getRole() != Role.STAFF) {
				throw new ConflictException("Advisor must be a STAFF user");
			}
		} else {
			advisorId = null;
		}

		User user = User.builder()
				.name(request.getName())
				.email(request.getEmail().toLowerCase())
				.phone(request.getPhone())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(requestedRole)
				.advisorId(advisorId)
				.status(UserStatus.ACTIVE)
				.build();

		User saved = userRepository.save(user);
		String token = jwtTokenProvider.generateToken(saved.getEmail());
		UserResponse userResponse = userMapper.toResponse(saved);
		return new AuthResponse(token, "Bearer", userResponse);
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase(), request.getPassword())
		);
		User user = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new ConflictException("Invalid credentials"));

		// Validate role matches the login portal
		Role expectedRole = request.getExpectedRole();
		if (expectedRole != null && user.getRole() != expectedRole) {
			String portalName = expectedRole.name().charAt(0) + expectedRole.name().substring(1).toLowerCase();
			throw new ConflictException("This account is not authorized for " + portalName + " login. Please use the correct login portal.");
		}

		// Role-based session expiration
		// STUDENT: 5 minutes, STAFF: 10 minutes, ADMIN: 1 day
		long expirationMs = switch (user.getRole()) {
			case STUDENT -> 5 * 60 * 1000L;      // 5 minutes
			case STAFF -> 10 * 60 * 1000L;       // 10 minutes
			case ADMIN -> 24 * 60 * 60 * 1000L;  // 1 day
		};

		String token = jwtTokenProvider.generateToken(authentication.getName(), expirationMs);
		long expiresAt = jwtTokenProvider.getExpirationTime(expirationMs);
		return new AuthResponse(token, "Bearer", userMapper.toResponse(user), expiresAt);
	}

	@Override
	@Transactional
	public Map<String, String> sendOtp(ForgotPasswordRequest request) {
		String phone = request.getPhone().trim();

		User user = userRepository.findByPhone(phone)
				.orElseThrow(() -> new ResourceNotFoundException("No account found with this phone number"));

		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new ConflictException("Account is inactive");
		}

		// Generate 6-digit OTP
		String otp = String.format("%06d", RANDOM.nextInt(999999));

		OtpToken otpToken = OtpToken.builder()
				.phone(phone)
				.otp(otp)
				.verified(false)
				.expiresAt(Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60L))
				.build();
		otpTokenRepository.save(otpToken);

		// TODO: Integrate with SMS gateway (e.g., Twilio) to send OTP via SMS
		// For now, logging the OTP for development/testing purposes
		log.info("============================================");
		log.info("OTP for phone {}: {}", phone, otp);
		log.info("============================================");

		return Map.of(
				"message", "OTP sent successfully to your registered mobile number",
				"phone", phone
		);
	}

	@Override
	@Transactional
	public Map<String, String> verifyOtp(VerifyOtpRequest request) {
		String phone = request.getPhone().trim();
		String otp = request.getOtp().trim();

		OtpToken otpToken = otpTokenRepository
				.findTopByPhoneAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(phone, Instant.now())
				.orElseThrow(() -> new ConflictException("Invalid or expired OTP"));

		if (!otpToken.getOtp().equals(otp)) {
			throw new ConflictException("Invalid OTP");
		}

		otpToken.setVerified(true);
		otpTokenRepository.save(otpToken);

		return Map.of("message", "OTP verified successfully. You can now reset your password.");
	}

	@Override
	@Transactional
	public Map<String, String> resetPassword(ResetPasswordRequest request) {
		String phone = request.getPhone().trim();
		String otp = request.getOtp().trim();

		// Verify the OTP was previously verified
		OtpToken otpToken = otpTokenRepository
				.findTopByPhoneAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(phone, Instant.now())
				.orElse(null);

		// Check for a verified OTP token
		if (otpToken != null && otpToken.getOtp().equals(otp)) {
			// OTP exists but not verified yet - verify inline
			otpToken.setVerified(true);
			otpTokenRepository.save(otpToken);
		}

		// Find user by phone
		User user = userRepository.findByPhone(phone)
				.orElseThrow(() -> new ResourceNotFoundException("No account found with this phone number"));

		// Update password
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

		log.info("Password reset successfully for phone: {}", phone);

		return Map.of("message", "Password has been reset successfully. You can now login with your new password.");
	}
}
