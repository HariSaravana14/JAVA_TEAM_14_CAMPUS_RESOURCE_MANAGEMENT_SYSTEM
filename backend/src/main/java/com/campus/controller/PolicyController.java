package com.campus.controller;

import com.campus.dto.response.PolicyRemainingResponse;
import com.campus.entity.User;
import com.campus.exception.ResourceNotFoundException;
import com.campus.repository.UserRepository;
import com.campus.service.PolicyService;
import com.campus.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyController {

	private final PolicyService policyService;
	private final UserRepository userRepository;

	@GetMapping("/remaining")
	public ResponseEntity<PolicyRemainingResponse> remaining() {
		String email = SecurityUtil.requireCurrentUsername();
		User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return ResponseEntity.ok(policyService.remainingForUser(user));
	}
}
