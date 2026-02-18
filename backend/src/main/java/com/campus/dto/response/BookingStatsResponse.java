package com.campus.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingStatsResponse {
	private long totalBookings;
	private long pendingBookings;
	private long approvedBookings;
	private long rejectedBookings;
}
