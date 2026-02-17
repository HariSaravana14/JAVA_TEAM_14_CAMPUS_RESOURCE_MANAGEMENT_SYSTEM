package com.campus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ApiErrorResponse {
	private Instant timestamp;
	private int status;
	private String error;
	private String message;
	private String path;
	private List<FieldErrorItem> fieldErrors;
}
