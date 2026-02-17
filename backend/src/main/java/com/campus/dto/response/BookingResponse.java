package com.campus.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.campus.enums.ApprovalStage;
import com.campus.enums.VisibilityType;

import lombok.Data;

@Data
public class BookingResponse {
	private UUID id;
	private UUID userId;
	private UUID resourceId;
	private LocalDate bookingDate;
	private LocalTime startTime;
	private LocalTime endTime;
	private Integer durationHours;
	private ApprovalStage approvalStage;
	private VisibilityType visibility;
	private UUID staffApprovedBy;
	private Instant staffApprovedAt;
	private UUID adminApprovedBy;
	private Instant adminApprovedAt;
	private Instant createdAt;
	private Instant updatedAt;
}
