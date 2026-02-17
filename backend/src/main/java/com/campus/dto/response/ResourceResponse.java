package com.campus.dto.response;

import java.time.Instant;
import java.util.UUID;

import com.campus.enums.ResourceStatus;

import lombok.Data;

@Data
public class ResourceResponse {
	private UUID id;
	private String name;
	private String type;
	private Integer capacity;
	private ResourceStatus status;
	private Instant createdAt;
	private Instant updatedAt;
}
