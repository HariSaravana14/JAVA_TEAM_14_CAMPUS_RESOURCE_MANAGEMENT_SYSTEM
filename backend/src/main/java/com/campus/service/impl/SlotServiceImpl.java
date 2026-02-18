package com.campus.service.impl;

import com.campus.dto.response.TimeSlotResponse;
import com.campus.entity.Booking;
import com.campus.entity.Resource;
import com.campus.enums.ApprovalStage;
import com.campus.enums.ResourceStatus;
import com.campus.exception.ConflictException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.BookingRepository;
import com.campus.repository.ResourceRepository;
import com.campus.service.SlotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

	private final ResourceRepository resourceRepository;
	private final BookingRepository bookingRepository;

	// Operating hours: 9 AM to 4 PM
	private static final LocalTime OPERATING_START = LocalTime.of(9, 0);
	private static final LocalTime OPERATING_END = LocalTime.of(16, 0);
	
	// Lunch break: 12:30 PM to 1:30 PM
	private static final LocalTime LUNCH_START = LocalTime.of(12, 30);
	private static final LocalTime LUNCH_END = LocalTime.of(13, 30);
	
	// Slot duration in minutes
	private static final int SLOT_DURATION_MINUTES = 60;

	// Stages that count as "booked" (not rejected/cancelled)
	private static final List<ApprovalStage> EXCLUDED_STAGES = List.of(
		ApprovalStage.REJECTED, 
		ApprovalStage.CANCELLED
	);

	private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

	@Override
	public List<TimeSlotResponse> getAvailableSlots(UUID resourceId, LocalDate date) {
		// Validate resource exists and is available
		Resource resource = resourceRepository.findById(resourceId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		
		if (resource.getStatus() != ResourceStatus.AVAILABLE) {
			throw new ConflictException("Resource is not available for booking");
		}

		// Don't allow booking for past dates
		if (date.isBefore(LocalDate.now())) {
			throw new ConflictException("Cannot book for past dates");
		}

		// Generate all possible slots for the day
		List<TimeSlotResponse> slots = generateDaySlots();

		// Get existing bookings for this resource and date (excluding rejected/cancelled)
		List<Booking> existingBookings = bookingRepository.findByResourceIdAndBookingDateAndApprovalStageNotIn(
			resourceId, date, EXCLUDED_STAGES
		);

		// Mark slots as unavailable if they overlap with existing bookings
		for (TimeSlotResponse slot : slots) {
			for (Booking booking : existingBookings) {
				if (isOverlapping(slot.getStartTime(), slot.getEndTime(), 
						booking.getStartTime(), booking.getEndTime())) {
					slot.setAvailable(false);
					break;
				}
			}
		}

		// If booking for today, disable past slots
		if (date.equals(LocalDate.now())) {
			LocalTime now = LocalTime.now();
			for (TimeSlotResponse slot : slots) {
				if (slot.getStartTime().isBefore(now)) {
					slot.setAvailable(false);
				}
			}
		}

		return slots;
	}

	/**
	 * Generate all time slots for a day based on operating hours.
	 * Excludes lunch break time.
	 */
	private List<TimeSlotResponse> generateDaySlots() {
		List<TimeSlotResponse> slots = new ArrayList<>();
		LocalTime current = OPERATING_START;

		while (current.plusMinutes(SLOT_DURATION_MINUTES).compareTo(OPERATING_END) <= 0) {
			LocalTime slotEnd = current.plusMinutes(SLOT_DURATION_MINUTES);
			
			// Check if this slot overlaps with lunch break
			boolean overlapsLunch = isOverlapping(current, slotEnd, LUNCH_START, LUNCH_END);
			
			if (!overlapsLunch) {
				String label = current.format(TIME_FORMATTER) + " - " + slotEnd.format(TIME_FORMATTER);
				slots.add(TimeSlotResponse.builder()
						.startTime(current)
						.endTime(slotEnd)
						.available(true)
						.label(label)
						.build());
			}
			
			current = slotEnd;
		}

		return slots;
	}

	/**
	 * Check if two time ranges overlap.
	 */
	private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
		// Two ranges overlap if start1 < end2 AND start2 < end1
		return start1.isBefore(end2) && start2.isBefore(end1);
	}
}
