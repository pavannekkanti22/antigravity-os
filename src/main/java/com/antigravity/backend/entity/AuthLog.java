package com.antigravity.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auth_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String ipAddress;

    private String userAgent;

    private String deviceType;

    private String location;

    private Long sessionDuration;

    private boolean suspicious;

    @Column(length = 500)
    private String riskReason;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }
}
