package com.campus.security;

import com.campus.entity.User;
import com.campus.enums.UserStatus;
import com.campus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username.toLowerCase())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new UsernameNotFoundException("User is inactive");
		}
		return UserPrincipal.from(user);
	}
}
