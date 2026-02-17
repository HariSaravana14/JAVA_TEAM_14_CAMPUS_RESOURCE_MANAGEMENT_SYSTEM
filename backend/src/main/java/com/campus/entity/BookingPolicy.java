package com.campus.entity;

import com.campus.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "booking_policy")
public class BookingPolicy {

	@Id
	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false, length = 20)
	private Role role;

	@Column(name = "max_bookings_per_day")
	private Integer maxBookingsPerDay;

	@Column(name = "max_bookings_per_month")
	private Integer maxBookingsPerMonth;

	@Column(name = "max_hours_per_day")
	private Integer maxHoursPerDay;

	@Column(name = "max_hours_per_month")
	private Integer maxHoursPerMonth;

	@Column(name = "is_unlimited", nullable = false)
	private Boolean isUnlimited;

	@PrePersist
	public void prePersist() {
		if (isUnlimited == null) {
			isUnlimited = false;
		}
	}
}
