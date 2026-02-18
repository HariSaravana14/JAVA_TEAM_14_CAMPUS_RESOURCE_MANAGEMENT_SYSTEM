package com.campus.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.dto.request.ForgotPasswordRequest;
import com.campus.dto.request.LoginRequest;
import com.campus.dto.request.RegisterRequest;
import com.campus.dto.request.ResetPasswordRequest;
import com.campus.dto.request.VerifyOtpRequest;
import com.campus.dto.response.AdvisorResponse;
import com.campus.dto.response.AuthResponse;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;
import com.campus.repository.UserRepository;
import com.campus.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	private final UserRepository userRepository;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@GetMapping("/advisors")
	public ResponseEntity<List<AdvisorResponse>> advisors() {
		List<AdvisorResponse> advisors = userRepository.findAllByRoleAndStatus(Role.STAFF, UserStatus.ACTIVE).stream()
				.map(u -> new AdvisorResponse(u.getId(), u.getName(), u.getEmail()))
				.toList();
		return ResponseEntity.ok(advisors);
	}

	@PostMapping("/forgot-password/send-otp")
	public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody ForgotPasswordRequest request) {
		return ResponseEntity.ok(authService.sendOtp(request));
	}

	@PostMapping("/forgot-password/verify-otp")
	public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
		return ResponseEntity.ok(authService.verifyOtp(request));
	}

	@PostMapping("/forgot-password/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		return ResponseEntity.ok(authService.resetPassword(request));
	}
}
