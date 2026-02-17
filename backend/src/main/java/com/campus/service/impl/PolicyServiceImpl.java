package com.campus.service.impl;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.dto.response.PolicyRemainingResponse;
import com.campus.entity.BookingPolicy;
import com.campus.entity.User;
import com.campus.enums.ApprovalStage;
import com.campus.enums.Role;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.BookingPolicyRepository;
import com.campus.repository.BookingRepository;
import com.campus.service.PolicyService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

	private static final List<ApprovalStage> EXCLUDED_STAGES = List.of(ApprovalStage.REJECTED, ApprovalStage.CANCELLED);

	private final BookingPolicyRepository bookingPolicyRepository;
	private final BookingRepository bookingRepository;

	@Override
	public BookingPolicy getPolicy(Role role) {
		return bookingPolicyRepository.findById(role)
				.orElseThrow(() -> new ResourceNotFoundException("Booking policy not found for role: " + role));
	}

	@Override
	public PolicyRemainingResponse remainingForUser(User user) {
		BookingPolicy policy = getPolicy(user.getRole());
		if (Boolean.TRUE.equals(policy.getIsUnlimited())) {
			return new PolicyRemainingResponse(user.getRole(), true, Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE);
		}

		LocalDate today = LocalDate.now();
		YearMonth ym = YearMonth.from(today);
		LocalDate monthStart = ym.atDay(1);
		LocalDate monthEnd = ym.atEndOfMonth();

		long usedBookingsToday = bookingRepository.countByUserIdAndBookingDateAndApprovalStageNotIn(user.getId(), today, EXCLUDED_STAGES);
		long usedBookingsMonth = bookingRepository.countByUserIdAndBookingDateBetweenAndApprovalStageNotIn(user.getId(), monthStart, monthEnd, EXCLUDED_STAGES);

		long usedHoursToday = bookingRepository.sumHoursByUserAndDate(user.getId(), today, EXCLUDED_STAGES);
		long usedHoursMonth = bookingRepository.sumHoursByUserAndDateRange(user.getId(), monthStart, monthEnd, EXCLUDED_STAGES);

		int remainingBookingsToday = Math.max(0, safe(policy.getMaxBookingsPerDay()) - (int) usedBookingsToday);
		int remainingBookingsMonth = Math.max(0, safe(policy.getMaxBookingsPerMonth()) - (int) usedBookingsMonth);
		int remainingHoursToday = Math.max(0, safe(policy.getMaxHoursPerDay()) - (int) usedHoursToday);
		int remainingHoursMonth = Math.max(0, safe(policy.getMaxHoursPerMonth()) - (int) usedHoursMonth);

		return new PolicyRemainingResponse(user.getRole(), false, remainingBookingsToday, remainingBookingsMonth, remainingHoursToday, remainingHoursMonth);
	}

	private int safe(Integer value) {
		return value == null ? 0 : value;
	}
}
