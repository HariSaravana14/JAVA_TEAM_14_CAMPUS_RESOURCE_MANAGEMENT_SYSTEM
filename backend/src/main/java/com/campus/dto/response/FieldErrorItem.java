package com.campus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FieldErrorItem {
	private String field;
	private String message;
}
