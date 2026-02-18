package com.campus.service;

import java.util.Map;

import com.campus.dto.request.ForgotPasswordRequest;
import com.campus.dto.request.LoginRequest;
import com.campus.dto.request.RegisterRequest;
import com.campus.dto.request.ResetPasswordRequest;
import com.campus.dto.request.VerifyOtpRequest;
import com.campus.dto.response.AuthResponse;

public interface AuthService {
	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request);

	Map<String, String> sendOtp(ForgotPasswordRequest request);

	Map<String, String> verifyOtp(VerifyOtpRequest request);

	Map<String, String> resetPassword(ResetPasswordRequest request);
}
