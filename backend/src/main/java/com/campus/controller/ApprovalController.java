package com.campus.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.dto.response.BookingResponse;
import com.campus.dto.response.BookingStatsResponse;
import com.campus.service.ApprovalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

	private final ApprovalService approvalService;

	@GetMapping("/staff/pending")
	@PreAuthorize("hasRole('STAFF')")
	public ResponseEntity<List<BookingResponse>> pendingForStaff() {
		return ResponseEntity.ok(approvalService.getPendingForStaff());
	}

	@PutMapping("/staff/{bookingId}")
	@PreAuthorize("hasRole('STAFF')")
	public ResponseEntity<BookingResponse> staffApprove(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.staffApprove(bookingId));
	}

	@PutMapping("/staff/{bookingId}/reject")
	@PreAuthorize("hasRole('STAFF')")
	public ResponseEntity<BookingResponse> staffReject(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.staffReject(bookingId));
	}

	@GetMapping("/staff/student-bookings")
	@PreAuthorize("hasRole('STAFF')")
	public ResponseEntity<List<BookingResponse>> staffStudentBookings() {
		return ResponseEntity.ok(approvalService.getStaffStudentBookings());
	}

	@GetMapping("/staff/stats")
	@PreAuthorize("hasRole('STAFF')")
	public ResponseEntity<BookingStatsResponse> staffBookingStats() {
		return ResponseEntity.ok(approvalService.getStaffBookingStats());
	}

	@GetMapping("/admin/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<BookingResponse>> pendingForAdmin() {
		return ResponseEntity.ok(approvalService.getPendingForAdmin());
	}

	@PutMapping("/admin/{bookingId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> adminApprove(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.adminApprove(bookingId));
	}

	@PutMapping("/admin/{bookingId}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> adminReject(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.adminReject(bookingId));
	}
}
