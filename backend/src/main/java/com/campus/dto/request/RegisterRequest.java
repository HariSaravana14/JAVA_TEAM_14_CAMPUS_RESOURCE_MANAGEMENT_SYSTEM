package com.campus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class RegisterRequest {

	@NotBlank
	@Size(max = 200)
	private String name;

	@NotBlank
	@Email
	@Size(max = 255)
	private String email;

	@Size(max = 30)
	private String phone;

	@NotBlank
	@Size(min = 8, max = 100)
	private String password;

	private UUID advisorId;
}
