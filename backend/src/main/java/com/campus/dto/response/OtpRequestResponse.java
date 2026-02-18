package com.campus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpRequestResponse {
	private String message;
	private long expiresInSeconds;
}
