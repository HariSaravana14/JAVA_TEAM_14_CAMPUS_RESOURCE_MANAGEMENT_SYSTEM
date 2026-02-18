package com.campus.service.impl;

import com.campus.dto.request.ChangeResourceStatusRequest;
import com.campus.dto.request.CreateResourceRequest;
import com.campus.dto.request.UpdateResourceRequest;
import com.campus.dto.response.ResourceResponse;
import com.campus.entity.Resource;
import com.campus.exception.ResourceNotFoundException;
import com.campus.mapper.ResourceMapper;
import com.campus.repository.ResourceRepository;
import com.campus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

	private final ResourceRepository resourceRepository;
	private final ResourceMapper resourceMapper;

	@Override
	@Transactional
	public ResourceResponse createResource(CreateResourceRequest request) {
		Resource resource = Resource.builder()
				.name(request.getName())
				.type(request.getType())
				.capacity(request.getCapacity())
				.build();
		return resourceMapper.toResponse(resourceRepository.save(resource));
	}

	@Override
	public ResourceResponse getResourceById(UUID id) {
		Resource resource = resourceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		return resourceMapper.toResponse(resource);
	}

	@Override
	@Transactional
	public ResourceResponse updateResource(UUID id, UpdateResourceRequest request) {
		Resource resource = resourceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (request.getName() != null) {
			resource.setName(request.getName());
		}
		if (request.getType() != null) {
			resource.setType(request.getType());
		}
		if (request.getCapacity() != null) {
			resource.setCapacity(request.getCapacity());
		}
		if (request.getStatus() != null) {
			resource.setStatus(request.getStatus());
		}

		return resourceMapper.toResponse(resourceRepository.save(resource));
	}

	@Override
	public List<ResourceResponse> getAllResources() {
		return resourceRepository.findAll().stream().map(resourceMapper::toResponse).toList();
	}

	@Override
	@Transactional
	public ResourceResponse changeStatus(UUID id, ChangeResourceStatusRequest request) {
		Resource resource = resourceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		resource.setStatus(request.getStatus());
		return resourceMapper.toResponse(resourceRepository.save(resource));
	}

	@Override
	@Transactional
	public void deleteResource(UUID id) {
		Resource resource = resourceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		resourceRepository.delete(resource);
	}
}
