package com.campus.dto.response;

import com.campus.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyRemainingResponse {
	private Role role;
	private boolean unlimited;
	private int remainingBookingsToday;
	private int remainingBookingsThisMonth;
	private int remainingHoursToday;
	private int remainingHoursThisMonth;
}
