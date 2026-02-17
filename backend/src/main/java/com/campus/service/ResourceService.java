package com.campus.service;

import com.campus.dto.request.ChangeResourceStatusRequest;
import com.campus.dto.request.CreateResourceRequest;
import com.campus.dto.request.UpdateResourceRequest;
import com.campus.dto.response.ResourceResponse;

import java.util.List;
import java.util.UUID;

public interface ResourceService {
	ResourceResponse createResource(CreateResourceRequest request);

	ResourceResponse updateResource(UUID id, UpdateResourceRequest request);

	List<ResourceResponse> getAllResources();

	ResourceResponse changeStatus(UUID id, ChangeResourceStatusRequest request);
}
