package com.campus.service;

import com.campus.dto.request.CreateBookingRequest;
import com.campus.entity.User;

public interface ValidationService {
	int calculateDurationHours(CreateBookingRequest request);

	void validateBookingCreation(User user, CreateBookingRequest request, int durationHours);
}
