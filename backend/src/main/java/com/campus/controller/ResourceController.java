package com.campus.controller;

import com.campus.dto.request.ChangeResourceStatusRequest;
import com.campus.dto.request.CreateResourceRequest;
import com.campus.dto.request.UpdateResourceRequest;
import com.campus.dto.response.ResourceResponse;
import com.campus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

	private final ResourceService resourceService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResourceResponse> create(@Valid @RequestBody CreateResourceRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(request));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResourceResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateResourceRequest request) {
		return ResponseEntity.ok(resourceService.updateResource(id, request));
	}

	@GetMapping
	public ResponseEntity<List<ResourceResponse>> all() {
		return ResponseEntity.ok(resourceService.getAllResources());
	}

	@PatchMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResourceResponse> changeStatus(@PathVariable UUID id, @Valid @RequestBody ChangeResourceStatusRequest request) {
		return ResponseEntity.ok(resourceService.changeStatus(id, request));
	}
}
