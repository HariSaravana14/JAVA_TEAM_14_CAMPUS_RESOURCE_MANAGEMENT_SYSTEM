package com.campus.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdvisorResponse {
	private UUID id;
	private String name;
	private String email;
}
