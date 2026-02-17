package com.campus.service;

import com.campus.dto.request.LoginRequest;
import com.campus.dto.request.RegisterRequest;
import com.campus.dto.response.AuthResponse;

public interface AuthService {
	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request);
}
