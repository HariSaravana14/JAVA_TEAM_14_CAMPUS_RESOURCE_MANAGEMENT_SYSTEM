package com.campus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpVerifyResponse {
	private String resetToken;
	private long expiresInSeconds;
}
