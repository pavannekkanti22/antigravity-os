package com.antigravity.backend.repository;

import com.antigravity.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    Long countByIsReadFalse();
}