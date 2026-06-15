package com.antigravity.backend.security;

import com.antigravity.backend.entity.Notification;
import com.antigravity.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(
            String title,
            String message,
            String type
    ) {

        notificationRepository.save(
                Notification.builder()
                        .title(title)
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }
}