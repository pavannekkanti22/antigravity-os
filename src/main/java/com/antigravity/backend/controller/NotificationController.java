package com.antigravity.backend.controller;

import com.antigravity.backend.entity.Notification;
import com.antigravity.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getNotifications() {

        return notificationRepository
                .findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/read")
    public String markAsRead(
            @PathVariable Long id
    ) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow();

        notification.setIsRead(true);

        notificationRepository.save(notification);

        return "Notification marked as read";
    }

    @PutMapping("/read-all")
    public String markAllRead() {

        System.out.println("MARK ALL READ REACHED");

        List<Notification> notifications =
                notificationRepository.findAll();

        notifications.forEach(n ->
                n.setIsRead(true));

        notificationRepository.saveAll(notifications);

        return "All notifications marked as read";
    }

    @GetMapping("/unread-count")
    public Long getUnreadCount() {

        return notificationRepository
                .countByIsReadFalse();
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(
            @PathVariable Long id
    ) {

        notificationRepository.deleteById(id);

        return "Notification deleted";
    }
}