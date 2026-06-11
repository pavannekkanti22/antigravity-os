package com.antigravity.backend.repository;

import com.antigravity.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findFirstByEmailAndOtpAndUsedAndExpiryTimeAfterOrderByIdDesc(
            String email,
            String otp,
            Boolean used,
            LocalDateTime now
    );
}
