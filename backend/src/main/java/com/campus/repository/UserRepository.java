package com.campus.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.entity.User;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);

	Optional<User> findByIdAndStatus(UUID id, UserStatus status);

	List<User> findAllByStatus(UserStatus status);

	List<User> findAllByRoleAndStatus(Role role, UserStatus status);

	List<User> findByAdvisorId(UUID advisorId);

	List<User> findByAdvisorIdAndStatus(UUID advisorId, UserStatus status);

	long countByAdvisorId(UUID advisorId);

	long countByAdvisorIdAndStatus(UUID advisorId, UserStatus status);
}
