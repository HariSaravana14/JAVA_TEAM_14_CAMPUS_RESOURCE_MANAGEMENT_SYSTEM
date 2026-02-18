package com.campus.service.impl;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.entity.BookingPolicy;
import com.campus.entity.Resource;
import com.campus.entity.User;
import com.campus.enums.ApprovalStage;
import com.campus.exception.BookingLimitExceededException;
import com.campus.exception.ConflictException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.BookingRepository;
import com.campus.repository.ResourceRepository;
import com.campus.service.PolicyService;
import com.campus.service.ValidationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ValidationServiceImpl implements ValidationService {

	private static final List<ApprovalStage> EXCLUDED_STAGES = List.of(ApprovalStage.REJECTED, ApprovalStage.CANCELLED);

	// Operating hours: 9 AM to 4 PM
	private static final LocalTime OPERATING_START = LocalTime.of(9, 0);
	private static final LocalTime OPERATING_END = LocalTime.of(16, 0);
	
	// Lunch break: 12:30 PM to 1:30 PM
	private static final LocalTime LUNCH_START = LocalTime.of(12, 30);
	private static final LocalTime LUNCH_END = LocalTime.of(13, 30);

	private final ResourceRepository resourceRepository;
	private final BookingRepository bookingRepository;
	private final PolicyService policyService;

	@Override
	public int calculateDurationHours(CreateBookingRequest request) {
		if (request.getStartTime() == null || request.getEndTime() == null) {
			throw new ConflictException("startTime and endTime are required");
		}
		long minutes = Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
		if (minutes <= 0) {
			throw new ConflictException("endTime must be after startTime");
		}
		if (minutes % 60 != 0) {
			throw new ConflictException("Booking duration must be in full hours");
		}
		return (int) (minutes / 60);
	}

	@Override
	public void validateBookingCreation(User user, CreateBookingRequest request, int durationHours) {
		if (request.getBookingDate() == null || request.getResourceId() == null) {
			throw new ConflictException("bookingDate and resourceId are required");
		}
		if (durationHours <= 0) {
			throw new ConflictException("Invalid duration");
		}

		// Validate booking date is not in the past
		if (request.getBookingDate().isBefore(LocalDate.now())) {
			throw new ConflictException("Cannot book for past dates");
		}

		// Validate operating hours
		LocalTime startTime = request.getStartTime();
		LocalTime endTime = request.getEndTime();
		
		if (startTime.isBefore(OPERATING_START)) {
			throw new ConflictException("Booking cannot start before " + OPERATING_START + " (9:00 AM)");
		}
		if (endTime.isAfter(OPERATING_END)) {
			throw new ConflictException("Booking cannot end after " + OPERATING_END + " (4:00 PM)");
		}

		// Validate lunch break - check if booking overlaps with lunch
		if (isOverlapping(startTime, endTime, LUNCH_START, LUNCH_END)) {
			throw new ConflictException("Booking cannot overlap with lunch break (12:30 PM - 1:30 PM)");
		}

		// If booking for today, ensure start time is not in the past
		if (request.getBookingDate().equals(LocalDate.now()) && startTime.isBefore(LocalTime.now())) {
			throw new ConflictException("Cannot book a slot that has already passed");
		}

		Resource resource = resourceRepository.findById(request.getResourceId())
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!resource.getStatus().name().equals("AVAILABLE")) {
			throw new ConflictException("Resource is not available for booking");
		}

		boolean conflict = bookingRepository.existsByResourceIdAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThanAndApprovalStageNotIn(
			request.getResourceId(),
			request.getBookingDate(),
			request.getEndTime(),
			request.getStartTime(),
			EXCLUDED_STAGES
		);
		if (conflict) {
			throw new ConflictException("Resource already booked for the selected time range");
		}

		BookingPolicy policy = policyService.getPolicy(user.getRole());
		if (Boolean.TRUE.equals(policy.getIsUnlimited())) {
			return;
		}

		LocalDate date = request.getBookingDate();
		YearMonth ym = YearMonth.from(date);
		LocalDate monthStart = ym.atDay(1);
		LocalDate monthEnd = ym.atEndOfMonth();

		long usedBookingsDay = bookingRepository.countByUserIdAndBookingDateAndApprovalStageNotIn(user.getId(), date, EXCLUDED_STAGES);
		long usedBookingsMonth = bookingRepository.countByUserIdAndBookingDateBetweenAndApprovalStageNotIn(user.getId(), monthStart, monthEnd, EXCLUDED_STAGES);

		long usedHoursDay = bookingRepository.sumHoursByUserAndDate(user.getId(), date, EXCLUDED_STAGES);
		long usedHoursMonth = bookingRepository.sumHoursByUserAndDateRange(user.getId(), monthStart, monthEnd, EXCLUDED_STAGES);

		int maxBookingsDay = safe(policy.getMaxBookingsPerDay());
		int maxBookingsMonth = safe(policy.getMaxBookingsPerMonth());
		int maxHoursDay = safe(policy.getMaxHoursPerDay());
		int maxHoursMonth = safe(policy.getMaxHoursPerMonth());

		if (maxBookingsDay > 0 && usedBookingsDay + 1 > maxBookingsDay) {
			throw new BookingLimitExceededException("Daily booking limit exceeded");
		}
		if (maxBookingsMonth > 0 && usedBookingsMonth + 1 > maxBookingsMonth) {
			throw new BookingLimitExceededException("Monthly booking limit exceeded");
		}
		if (maxHoursDay > 0 && usedHoursDay + durationHours > maxHoursDay) {
			throw new BookingLimitExceededException("Daily hours limit exceeded");
		}
		if (maxHoursMonth > 0 && usedHoursMonth + durationHours > maxHoursMonth) {
			throw new BookingLimitExceededException("Monthly hours limit exceeded");
		}
	}

	/**
	 * Check if two time ranges overlap.
	 */
	private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
		return start1.isBefore(end2) && start2.isBefore(end1);
	}

	private int safe(Integer value) {
		return value == null ? 0 : value;
	}
}
