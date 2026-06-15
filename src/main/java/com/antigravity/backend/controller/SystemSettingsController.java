package com.antigravity.backend.controller;

import com.antigravity.backend.entity.ActivityLog;
import com.antigravity.backend.entity.SystemSettings;
import com.antigravity.backend.repository.ActivityLogRepository;
import com.antigravity.backend.repository.SystemSettingsRepository;
import com.antigravity.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SystemSettingsController {

    private final SystemSettingsRepository repository;
    private final ActivityLogRepository activityLogRepository;
    private final JwtService jwtService;

    private String getAdminEmail(String authHeader) {

        String token =
                authHeader.replace("Bearer ", "");

        return jwtService.extractEmail(token);
    }

    @GetMapping
    public SystemSettings getSettings() {

        return repository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {

                    SystemSettings settings =
                            SystemSettings.builder()
                                    .applicationName("Antigravity OS")
                                    .companyName("Antigravity")
                                    .supportEmail("admin@antigravity.com")
                                    .sessionTimeout(30)
                                    .maintenanceMode(false)
                                    .userRegistrationEnabled(true)
                                    .passwordMinLength(8)
                                    .build();

                    return repository.save(settings);
                });
    }

    @PutMapping
    public SystemSettings updateSettings(
            @RequestBody SystemSettings settings,
            @RequestHeader("Authorization") String authHeader
    ) {

        settings.setId(1L);

        SystemSettings saved =
                repository.save(settings);

        activityLogRepository.save(
                ActivityLog.builder()
                        .adminEmail(
                                getAdminEmail(authHeader)
                        )
                        .action("Platform security policy modified")
                        .targetUser("SYSTEM")
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return saved;
    }
}