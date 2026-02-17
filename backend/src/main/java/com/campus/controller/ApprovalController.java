package com.campus.controller;

import com.campus.dto.response.BookingResponse;
import com.campus.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

	private final ApprovalService approvalService;

	@PutMapping("/staff/{bookingId}")
	public ResponseEntity<BookingResponse> staffApprove(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.staffApprove(bookingId));
	}

	@PutMapping("/admin/{bookingId}")
	public ResponseEntity<BookingResponse> adminApprove(@PathVariable UUID bookingId) {
		return ResponseEntity.ok(approvalService.adminApprove(bookingId));
	}
}
