package com.campus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordOtpRequest {
	@NotBlank
	@Size(max = 30)
	private String phone;
}
