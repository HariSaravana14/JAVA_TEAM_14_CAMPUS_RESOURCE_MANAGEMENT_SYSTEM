package com.campus.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.dto.request.LoginRequest;
import com.campus.dto.request.RegisterRequest;
import com.campus.dto.response.AuthResponse;
import com.campus.dto.response.UserResponse;
import com.campus.entity.User;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;
import com.campus.exception.ConflictException;
import com.campus.mapper.UserMapper;
import com.campus.repository.UserRepository;
import com.campus.security.JwtTokenProvider;
import com.campus.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserMapper userMapper;

	@Override
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
			throw new ConflictException("Email already registered");
		});

		User user = User.builder()
				.name(request.getName())
				.email(request.getEmail().toLowerCase())
				.phone(request.getPhone())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.STUDENT)
				.advisorId(request.getAdvisorId())
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
		String token = jwtTokenProvider.generateToken(authentication.getName());
		User user = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new ConflictException("Invalid credentials"));
		return new AuthResponse(token, "Bearer", userMapper.toResponse(user));
	}
}
