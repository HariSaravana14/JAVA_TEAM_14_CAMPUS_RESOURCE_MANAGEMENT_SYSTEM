package com.campus.service;

import com.campus.dto.response.BookingResponse;

import java.util.UUID;

public interface ApprovalService {
	BookingResponse staffApprove(UUID bookingId);

	BookingResponse adminApprove(UUID bookingId);
}
