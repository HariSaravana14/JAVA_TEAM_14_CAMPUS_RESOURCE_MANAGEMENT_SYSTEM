package com.campus.service;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
	BookingResponse createBooking(CreateBookingRequest request);

	List<BookingResponse> getMyBookings();

	List<BookingResponse> getAllBookings();
}
