package com.antigravity.backend.repository;

import com.antigravity.backend.entity.AuthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthLogRepository extends JpaRepository<AuthLog, Long> {
    List<AuthLog> findAllByOrderByTimestampDesc();

    List<AuthLog> findByEmailOrderByTimestampDesc(String email);

    List<AuthLog> findByActionOrderByTimestampDesc(String action);

    List<AuthLog> findBySuspiciousTrueOrderByTimestampDesc();

    List<AuthLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

    long countByAction(String action);

    long countBySuspiciousTrue();

    long countByActionAndTimestampAfter(String action, LocalDateTime after);

    Optional<AuthLog> findTopByEmailAndActionOrderByTimestampDesc(String email, String action);

    @Query("SELECT COUNT(DISTINCT a.email) FROM AuthLog a WHERE a.action = 'LOGIN_SUCCESS' AND a.timestamp > ?1")
    long countDistinctActiveUsersSince(LocalDateTime since);
}
