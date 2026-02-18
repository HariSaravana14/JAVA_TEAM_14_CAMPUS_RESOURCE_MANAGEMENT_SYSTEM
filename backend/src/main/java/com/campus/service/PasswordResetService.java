package com.campus.service;

import com.campus.dto.request.PasswordOtpRequest;
import com.campus.dto.request.PasswordOtpVerifyRequest;
import com.campus.dto.request.PasswordResetRequest;
import com.campus.dto.response.OtpRequestResponse;
import com.campus.dto.response.OtpVerifyResponse;
import com.campus.dto.response.PasswordResetResponse;

public interface PasswordResetService {
	OtpRequestResponse requestOtp(PasswordOtpRequest request);

	OtpVerifyResponse verifyOtp(PasswordOtpVerifyRequest request);

	PasswordResetResponse resetPassword(PasswordResetRequest request);
}
