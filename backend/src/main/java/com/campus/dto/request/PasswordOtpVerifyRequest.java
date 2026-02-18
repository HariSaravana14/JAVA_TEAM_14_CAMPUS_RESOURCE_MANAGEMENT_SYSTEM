package com.campus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordOtpVerifyRequest {
	@NotBlank
	@Size(max = 30)
	private String phone;

	@NotBlank
	@Size(min = 4, max = 10)
	private String otp;
}
