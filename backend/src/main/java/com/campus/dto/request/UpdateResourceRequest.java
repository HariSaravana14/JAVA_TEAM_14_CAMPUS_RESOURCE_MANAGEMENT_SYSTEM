package com.campus.dto.request;

import com.campus.enums.ResourceStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateResourceRequest {

	@Size(max = 255)
	private String name;

	@Size(max = 100)
	private String type;

	@Min(1)
	private Integer capacity;

	private ResourceStatus status;
}
