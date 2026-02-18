package com.campus.service;

import java.util.List;
import java.util.UUID;

import com.campus.dto.response.BookingResponse;
import com.campus.dto.response.BookingStatsResponse;

public interface ApprovalService {
	BookingResponse staffApprove(UUID bookingId);

	BookingResponse staffReject(UUID bookingId);

	BookingResponse adminApprove(UUID bookingId);

	BookingResponse adminReject(UUID bookingId);

	List<BookingResponse> getPendingForStaff();

	List<BookingResponse> getPendingForAdmin();

	List<BookingResponse> getStaffStudentBookings();

	BookingStatsResponse getStaffBookingStats();
}
