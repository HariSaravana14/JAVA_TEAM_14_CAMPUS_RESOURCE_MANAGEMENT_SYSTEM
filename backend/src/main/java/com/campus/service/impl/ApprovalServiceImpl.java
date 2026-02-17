package com.campus.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.dto.response.BookingResponse;
import com.campus.entity.Booking;
import com.campus.entity.BookingStatusHistory;
import com.campus.entity.User;
import com.campus.enums.ApprovalStage;
import com.campus.enums.Role;
import com.campus.enums.VisibilityType;
import com.campus.exception.ConflictException;
import com.campus.exception.ResourceNotFoundException;
import com.campus.mapper.BookingMapper;
import com.campus.repository.BookingRepository;
import com.campus.repository.BookingStatusHistoryRepository;
import com.campus.repository.UserRepository;
import com.campus.service.ApprovalService;
import com.campus.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalServiceImpl implements ApprovalService {

	private final BookingRepository bookingRepository;
	private final BookingStatusHistoryRepository historyRepository;
	private final UserRepository userRepository;
	private final BookingMapper bookingMapper;

	@Override
	@Transactional
	public BookingResponse staffApprove(UUID bookingId) {
		User staff = currentUser();
		if (staff.getRole() != Role.STAFF) {
			throw new ConflictException("Only STAFF can approve at staff stage");
		}

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
		if (booking.getApprovalStage() != ApprovalStage.PENDING_STAFF) {
			throw new ConflictException("Booking is not pending staff approval");
		}

		booking.setStaffApprovedBy(staff.getId());
		booking.setStaffApprovedAt(Instant.now());
		booking.setApprovalStage(ApprovalStage.PENDING_ADMIN);

		Booking saved = bookingRepository.save(booking);
		historyRepository.save(BookingStatusHistory.builder()
				.bookingId(saved.getId())
				.stage(saved.getApprovalStage())
				.changedBy(staff.getId())
				.build());
		return bookingMapper.toResponse(saved);
	}

	@Override
	@Transactional
	public BookingResponse adminApprove(UUID bookingId) {
		User admin = currentUser();
		if (admin.getRole() != Role.ADMIN) {
			throw new ConflictException("Only ADMIN can approve at admin stage");
		}

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
		if (booking.getApprovalStage() != ApprovalStage.PENDING_ADMIN) {
			throw new ConflictException("Booking is not pending admin approval");
		}

		User bookingOwner = userRepository.findById(booking.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Booking user not found"));

		booking.setAdminApprovedBy(admin.getId());
		booking.setAdminApprovedAt(Instant.now());

		if (bookingOwner.getRole() == Role.STAFF) {
			booking.setApprovalStage(ApprovalStage.APPROVED_STAFF_ONLY);
			booking.setVisibility(VisibilityType.STAFF_ONLY);
		} else {
			booking.setApprovalStage(ApprovalStage.APPROVED);
			booking.setVisibility(VisibilityType.PUBLIC);
		}

		Booking saved = bookingRepository.save(booking);
		historyRepository.save(BookingStatusHistory.builder()
				.bookingId(saved.getId())
				.stage(saved.getApprovalStage())
				.changedBy(admin.getId())
				.build());
		return bookingMapper.toResponse(saved);
	}

	private User currentUser() {
		String email = SecurityUtil.requireCurrentUsername();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}
}
