package com.campus.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.entity.User;
import com.campus.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByEmail(String email);

	Optional<User> findByIdAndStatus(UUID id, UserStatus status);

	List<User> findAllByStatus(UserStatus status);
}
