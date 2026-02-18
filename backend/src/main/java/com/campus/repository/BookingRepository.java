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

	@Query("select b from Booking b where b.approvalStage = :stage and b.userId in (select u.id from User u where u.advisorId = :advisorId)")
	List<Booking> findByApprovalStageAndAdvisorId(@Param("stage") ApprovalStage stage, @Param("advisorId") UUID advisorId);

	List<Booking> findByApprovalStageOrderByCreatedAtDesc(ApprovalStage approvalStage);

	List<Booking> findByResourceIdAndBookingDateAndApprovalStageNotIn(
			UUID resourceId,
			LocalDate bookingDate,
			Collection<ApprovalStage> excludedStages
	);

	// Find all bookings by students assigned to a specific advisor
	@Query("select b from Booking b where b.userId in (select u.id from User u where u.advisorId = :advisorId) order by b.createdAt desc")
	List<Booking> findAllByAdvisorId(@Param("advisorId") UUID advisorId);

	// Count bookings by approval stage for students of a specific advisor
	@Query("select count(b) from Booking b where b.approvalStage = :stage and b.userId in (select u.id from User u where u.advisorId = :advisorId)")
	long countByApprovalStageAndAdvisorId(@Param("stage") ApprovalStage stage, @Param("advisorId") UUID advisorId);

	// Count total bookings for students of a specific advisor
	@Query("select count(b) from Booking b where b.userId in (select u.id from User u where u.advisorId = :advisorId)")
	long countAllByAdvisorId(@Param("advisorId") UUID advisorId);
}
