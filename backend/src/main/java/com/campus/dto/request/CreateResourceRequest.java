package com.campus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateResourceRequest {

	@NotBlank
	@Size(max = 255)
	private String name;

	@NotBlank
	@Size(max = 100)
	private String type;

	@NotNull
	@Min(1)
	private Integer capacity;
}
