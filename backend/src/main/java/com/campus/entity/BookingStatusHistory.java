package com.campus.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.campus.enums.ApprovalStage;

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
@Table(name = "booking_status_history")
public class BookingStatusHistory {

	@Id
	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "id", length = 36, nullable = false, updatable = false, columnDefinition = "CHAR(36)")
	private UUID id;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "booking_id", length = 36, nullable = false, columnDefinition = "CHAR(36)")
	private UUID bookingId;

	@Enumerated(EnumType.STRING)
	@Column(name = "stage", nullable = false, length = 30)
	private ApprovalStage stage;

	@Column(name = "changed_at", nullable = false)
	private Instant changedAt;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "changed_by", length = 36, columnDefinition = "CHAR(36)")
	private UUID changedBy;

	@PrePersist
	public void prePersist() {
		if (id == null) {
			id = UUID.randomUUID();
		}
		if (changedAt == null) {
			changedAt = Instant.now();
		}
	}
}
