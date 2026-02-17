package com.campus.dto.response;

import java.time.Instant;
import java.util.UUID;

import com.campus.enums.Role;
import com.campus.enums.UserStatus;

import lombok.Data;

@Data
public class UserResponse {
	private UUID id;
	private String name;
	private String email;
	private String phone;
	private Role role;
	private UUID advisorId;
	private UserStatus status;
	private Instant createdAt;
	private Instant updatedAt;
}
