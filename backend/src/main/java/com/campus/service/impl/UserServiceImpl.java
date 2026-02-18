package com.campus.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.dto.request.UpdateUserRequest;
import com.campus.dto.response.StudentStatsResponse;
import com.campus.dto.response.UserResponse;
import com.campus.entity.User;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;
import com.campus.exception.ConflictException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.mapper.UserMapper;
import com.campus.repository.UserRepository;
import com.campus.service.UserService;
import com.campus.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;

	@Override
	public List<UserResponse> getAllUsers() {
		return userRepository.findAll().stream().map(userMapper::toResponse).toList();
	}

	@Override
	@Transactional
	public UserResponse updateUser(UUID id, UpdateUserRequest request) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (request.getName() != null) {
			user.setName(request.getName());
		}
		if (request.getPhone() != null) {
			user.setPhone(request.getPhone());
		}
		if (request.getRole() != null) {
			user.setRole(request.getRole());
		}
		if (request.getAdvisorId() != null) {
			user.setAdvisorId(request.getAdvisorId());
		}
		if (request.getStatus() != null) {
			user.setStatus(request.getStatus());
		}

		return userMapper.toResponse(userRepository.save(user));
	}

	@Override
	@Transactional
	public void softDeleteUser(UUID id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		user.setStatus(UserStatus.INACTIVE);
		userRepository.save(user);
	}

	@Override
	public List<UserResponse> getMyStudents() {
		User staff = currentUser();
		if (staff.getRole() != Role.STAFF) {
			throw new ConflictException("Only STAFF can view their students");
		}
		return userRepository.findByAdvisorId(staff.getId()).stream()
				.map(userMapper::toResponse)
				.toList();
	}

	@Override
	public StudentStatsResponse getMyStudentStats() {
		User staff = currentUser();
		if (staff.getRole() != Role.STAFF) {
			throw new ConflictException("Only STAFF can view student stats");
		}
		
		long total = userRepository.countByAdvisorId(staff.getId());
		long active = userRepository.countByAdvisorIdAndStatus(staff.getId(), UserStatus.ACTIVE);
		long inactive = userRepository.countByAdvisorIdAndStatus(staff.getId(), UserStatus.INACTIVE);
		
		return StudentStatsResponse.builder()
				.totalStudents(total)
				.activeStudents(active)
				.inactiveStudents(inactive)
				.build();
	}

	private User currentUser() {
		String email = SecurityUtil.requireCurrentUsername();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}
}
