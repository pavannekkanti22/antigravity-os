package com.antigravity.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = true)
    private String adminEmail;

    @Column(nullable = true)
    private String targetUser;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true, length = 1000)
    private String details;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
