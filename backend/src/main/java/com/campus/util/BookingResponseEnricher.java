package com.campus.util;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.campus.dto.response.BookingResponse;
import com.campus.entity.Resource;
import com.campus.entity.User;
import com.campus.repository.ResourceRepository;
import com.campus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingResponseEnricher {

	private final UserRepository userRepository;
	private final ResourceRepository resourceRepository;

	public BookingResponse enrich(BookingResponse response) {
		if (response == null) return null;

		// Fetch user name
		if (response.getUserId() != null) {
			userRepository.findById(response.getUserId())
					.ifPresent(user -> response.setUserName(user.getName()));
		}

		// Fetch resource name
		if (response.getResourceId() != null) {
			resourceRepository.findById(response.getResourceId())
					.ifPresent(resource -> response.setResourceName(resource.getName()));
		}

		// Fetch staff approver name
		if (response.getStaffApprovedBy() != null) {
			userRepository.findById(response.getStaffApprovedBy())
					.ifPresent(user -> response.setStaffApprovedByName(user.getName()));
		}

		// Fetch admin approver name
		if (response.getAdminApprovedBy() != null) {
			userRepository.findById(response.getAdminApprovedBy())
					.ifPresent(user -> response.setAdminApprovedByName(user.getName()));
		}

		return response;
	}

	public List<BookingResponse> enrichAll(List<BookingResponse> responses) {
		if (responses == null || responses.isEmpty()) return responses;

		// Collect all unique IDs
		Set<UUID> userIds = responses.stream()
				.flatMap(r -> {
					return java.util.stream.Stream.of(r.getUserId(), r.getStaffApprovedBy(), r.getAdminApprovedBy());
				})
				.filter(id -> id != null)
				.collect(Collectors.toSet());

		Set<UUID> resourceIds = responses.stream()
				.map(BookingResponse::getResourceId)
				.filter(id -> id != null)
				.collect(Collectors.toSet());

		// Batch fetch users and resources
		Map<UUID, User> usersMap = userRepository.findAllById(userIds).stream()
				.collect(Collectors.toMap(User::getId, Function.identity()));

		Map<UUID, Resource> resourcesMap = resourceRepository.findAllById(resourceIds).stream()
				.collect(Collectors.toMap(Resource::getId, Function.identity()));

		// Enrich each response
		for (BookingResponse response : responses) {
			if (response.getUserId() != null && usersMap.containsKey(response.getUserId())) {
				response.setUserName(usersMap.get(response.getUserId()).getName());
			}
			if (response.getResourceId() != null && resourcesMap.containsKey(response.getResourceId())) {
				response.setResourceName(resourcesMap.get(response.getResourceId()).getName());
			}
			if (response.getStaffApprovedBy() != null && usersMap.containsKey(response.getStaffApprovedBy())) {
				response.setStaffApprovedByName(usersMap.get(response.getStaffApprovedBy()).getName());
			}
			if (response.getAdminApprovedBy() != null && usersMap.containsKey(response.getAdminApprovedBy())) {
				response.setAdminApprovedByName(usersMap.get(response.getAdminApprovedBy()).getName());
			}
		}

		return responses;
	}
}
