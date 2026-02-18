package com.campus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
	private String token;
	private String tokenType;
	private UserResponse user;
	private Long expiresAt;

	public AuthResponse(String token, String tokenType, UserResponse user) {
		this.token = token;
		this.tokenType = tokenType;
		this.user = user;
		this.expiresAt = null;
	}
}
