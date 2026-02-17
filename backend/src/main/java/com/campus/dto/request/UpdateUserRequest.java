package com.campus.dto.request;

import java.util.UUID;

import com.campus.enums.Role;
import com.campus.enums.UserStatus;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

	@Size(max = 200)
	private String name;

	@Size(max = 30)
	private String phone;

	private Role role;

	private UUID advisorId;

	private UserStatus status;
}
