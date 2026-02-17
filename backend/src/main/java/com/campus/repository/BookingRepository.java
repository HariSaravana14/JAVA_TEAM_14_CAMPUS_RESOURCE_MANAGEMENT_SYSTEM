package com.campus.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campus.entity.Booking;
import com.campus.enums.ApprovalStage;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

	List<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId);

	List<Booking> findAllByOrderByCreatedAtDesc();

	boolean existsByResourceIdAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThanAndApprovalStageNotIn(
			UUID resourceId,
			LocalDate bookingDate,
			LocalTime startTime,
			LocalTime endTime,
			Collection<ApprovalStage> excludedStages
	);

	long countByUserIdAndBookingDateAndApprovalStageNotIn(UUID userId, LocalDate bookingDate, Collection<ApprovalStage> excludedStages);

	long countByUserIdAndBookingDateBetweenAndApprovalStageNotIn(UUID userId, LocalDate startDate, LocalDate endDate, Collection<ApprovalStage> excludedStages);

	@Query("select coalesce(sum(b.durationHours), 0) from Booking b where b.userId = :userId and b.bookingDate = :bookingDate and b.approvalStage not in :excluded")
	long sumHoursByUserAndDate(@Param("userId") UUID userId, @Param("bookingDate") LocalDate bookingDate, @Param("excluded") Collection<ApprovalStage> excluded);

	@Query("select coalesce(sum(b.durationHours), 0) from Booking b where b.userId = :userId and b.bookingDate between :startDate and :endDate and b.approvalStage not in :excluded")
	long sumHoursByUserAndDateRange(@Param("userId") UUID userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("excluded") Collection<ApprovalStage> excluded);
}
