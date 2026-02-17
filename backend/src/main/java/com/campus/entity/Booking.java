package com.campus.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.campus.enums.ApprovalStage;
import com.campus.enums.VisibilityType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "bookings", indexes = {
		@Index(name = "idx_booking_user_date", columnList = "user_id,booking_date"),
		@Index(name = "idx_booking_resource_date", columnList = "resource_id,booking_date")
})
public class Booking {

	@Id
	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "id", length = 36, nullable = false, updatable = false, columnDefinition = "CHAR(36)")
	private UUID id;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "user_id", length = 36, nullable = false, columnDefinition = "CHAR(36)")
	private UUID userId;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "resource_id", length = 36, nullable = false, columnDefinition = "CHAR(36)")
	private UUID resourceId;

	@Column(name = "booking_date", nullable = false)
	private LocalDate bookingDate;

	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;

	@Column(name = "duration_hours", nullable = false)
	private Integer durationHours;

	@Enumerated(EnumType.STRING)
	@Column(name = "approval_stage", nullable = false, length = 30)
	private ApprovalStage approvalStage;

	@Enumerated(EnumType.STRING)
	@Column(name = "visibility", nullable = false, length = 20)
	private VisibilityType visibility;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "staff_approved_by", length = 36, columnDefinition = "CHAR(36)")
	private UUID staffApprovedBy;

	@Column(name = "staff_approved_at")
	private Instant staffApprovedAt;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "admin_approved_by", length = 36, columnDefinition = "CHAR(36)")
	private UUID adminApprovedBy;

	@Column(name = "admin_approved_at")
	private Instant adminApprovedAt;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@PrePersist
	public void prePersist() {
		if (id == null) {
			id = UUID.randomUUID();
		}
		Instant now = Instant.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = Instant.now();
	}
}
