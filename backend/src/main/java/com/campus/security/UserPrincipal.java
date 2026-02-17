package com.campus.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.campus.entity.User;
import com.campus.enums.Role;
import com.campus.enums.UserStatus;

import lombok.Getter;

@Getter
public class UserPrincipal implements UserDetails {

	private final UUID id;
	private final String email;
	private final String password;
	private final Role role;
	private final UserStatus status;

	public UserPrincipal(UUID id, String email, String password, Role role, UserStatus status) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.role = role;
		this.status = status;
	}

	public static UserPrincipal from(User user) {
		return new UserPrincipal(user.getId(), user.getEmail(), user.getPassword(), user.getRole(), user.getStatus());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return status == UserStatus.ACTIVE;
	}
}
