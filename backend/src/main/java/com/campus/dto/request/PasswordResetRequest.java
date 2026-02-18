package com.campus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordResetRequest {
	@NotBlank
	private String resetToken;

	@NotBlank
	@Size(min = 8, max = 100)
	private String newPassword;
}
