package com.campus.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.dto.response.BookingResponse;
import com.campus.dto.response.TimeSlotResponse;
import com.campus.service.BookingService;
import com.campus.service.SlotService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;
	private final SlotService slotService;

	@PostMapping
	@PreAuthorize("hasAnyRole('STUDENT','STAFF','ADMIN')")
	public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
	}

	@GetMapping("/my")
	public ResponseEntity<List<BookingResponse>> myBookings() {
		return ResponseEntity.ok(bookingService.getMyBookings());
	}

	@GetMapping("/all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<BookingResponse>> allBookings() {
		return ResponseEntity.ok(bookingService.getAllBookings());
	}

	@GetMapping("/slots/{resourceId}")
	public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
			@PathVariable UUID resourceId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return ResponseEntity.ok(slotService.getAvailableSlots(resourceId, date));
	}
}
