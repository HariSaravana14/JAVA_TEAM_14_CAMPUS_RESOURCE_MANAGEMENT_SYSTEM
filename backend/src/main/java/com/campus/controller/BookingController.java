package com.campus.controller;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.dto.response.BookingResponse;
import com.campus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

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
}
