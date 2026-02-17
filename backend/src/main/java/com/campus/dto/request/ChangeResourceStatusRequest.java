package com.campus.dto.request;

import com.campus.enums.ResourceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeResourceStatusRequest {

	@NotNull
	private ResourceStatus status;
}
