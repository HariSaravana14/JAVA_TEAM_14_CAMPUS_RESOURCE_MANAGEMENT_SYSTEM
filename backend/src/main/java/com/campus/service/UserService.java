package com.campus.service;

import com.campus.dto.request.UpdateUserRequest;
import com.campus.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
	List<UserResponse> getAllUsers();

	UserResponse updateUser(UUID id, UpdateUserRequest request);

	void softDeleteUser(UUID id);
}
