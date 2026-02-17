package com.campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.entity.BookingPolicy;
import com.campus.enums.Role;

public interface BookingPolicyRepository extends JpaRepository<BookingPolicy, Role> {
}
