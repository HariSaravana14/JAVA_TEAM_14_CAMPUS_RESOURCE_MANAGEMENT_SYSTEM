package com.campus.service;

import com.campus.dto.response.PolicyRemainingResponse;
import com.campus.entity.BookingPolicy;
import com.campus.entity.User;
import com.campus.enums.Role;

public interface PolicyService {
	BookingPolicy getPolicy(Role role);

	PolicyRemainingResponse remainingForUser(User user);
}
