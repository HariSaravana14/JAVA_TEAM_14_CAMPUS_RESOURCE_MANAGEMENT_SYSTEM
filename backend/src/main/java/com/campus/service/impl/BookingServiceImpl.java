package com.campus.service.impl;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.dto.response.BookingResponse;
import com.campus.entity.Booking;
import com.campus.entity.BookingStatusHistory;
import com.campus.entity.User;
import com.campus.enums.ApprovalStage;
import com.campus.enums.VisibilityType;
import com.campus.exception.ResourceNotFoundException;
import com.campus.mapper.BookingMapper;
import com.campus.repository.BookingRepository;
import com.campus.repository.BookingStatusHistoryRepository;
import com.campus.repository.UserRepository;
import com.campus.service.BookingService;
import com.campus.service.ValidationService;
import com.campus.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

	private final UserRepository userRepository;
	private final BookingRepository bookingRepository;
	private final BookingStatusHistoryRepository historyRepository;
	private final ValidationService validationService;
	private final BookingMapper bookingMapper;

	@Override
	@Transactional
	public BookingResponse createBooking(CreateBookingRequest request) {
		String email = SecurityUtil.requireCurrentUsername();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		int durationHours = validationService.calculateDurationHours(request);
		validationService.validateBookingCreation(user, request, durationHours);

		Booking booking = Booking.builder()
				.userId(user.getId())
				.resourceId(request.getResourceId())
				.bookingDate(request.getBookingDate())
				.startTime(request.getStartTime())
				.endTime(request.getEndTime())
				.durationHours(durationHours)
				.build();

		switch (user.getRole()) {
			case STUDENT -> {
				booking.setApprovalStage(ApprovalStage.PENDING_STAFF);
				booking.setVisibility(VisibilityType.PRIVATE);
			}
			case STAFF -> {
				booking.setApprovalStage(ApprovalStage.PENDING_ADMIN);
				booking.setVisibility(VisibilityType.PRIVATE);
			}
			case ADMIN -> {
				booking.setApprovalStage(ApprovalStage.APPROVED);
				booking.setVisibility(VisibilityType.PUBLIC);
				booking.setAdminApprovedBy(user.getId());
				booking.setAdminApprovedAt(Instant.now());
			}
			default -> throw new IllegalStateException("Unsupported role: " + user.getRole());
		}

		Booking saved = bookingRepository.save(booking);
		historyRepository.save(BookingStatusHistory.builder()
				.bookingId(saved.getId())
				.stage(saved.getApprovalStage())
				.changedBy(user.getId())
				.build());

		return bookingMapper.toResponse(saved);
	}

	@Override
	public List<BookingResponse> getMyBookings() {
		String email = SecurityUtil.requireCurrentUsername();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(bookingMapper::toResponse).toList();
	}

	@Override
	public List<BookingResponse> getAllBookings() {
		return bookingRepository.findAllByOrderByCreatedAtDesc().stream().map(bookingMapper::toResponse).toList();
	}
}
