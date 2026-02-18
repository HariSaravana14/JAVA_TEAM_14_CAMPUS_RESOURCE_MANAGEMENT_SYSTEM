package com.campus.repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.entity.OtpToken;

public interface OtpTokenRepository extends JpaRepository<OtpToken, UUID> {

    Optional<OtpToken> findTopByPhoneAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String phone, Instant now);

    void deleteByExpiresAtBefore(Instant now);
}
