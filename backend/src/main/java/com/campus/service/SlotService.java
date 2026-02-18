package com.campus.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.campus.dto.response.TimeSlotResponse;

public interface SlotService {
	List<TimeSlotResponse> getAvailableSlots(UUID resourceId, LocalDate date);
}
