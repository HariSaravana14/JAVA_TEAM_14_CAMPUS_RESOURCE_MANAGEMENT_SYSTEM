package com.campus.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateBookingRequest {

	@NotNull
	private UUID resourceId;

	@NotNull
	private LocalDate bookingDate;

	@NotNull
	private LocalTime startTime;

	@NotNull
	private LocalTime endTime;
}
