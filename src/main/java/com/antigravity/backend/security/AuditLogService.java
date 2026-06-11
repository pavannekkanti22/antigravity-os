package com.antigravity.backend.security;

import com.antigravity.backend.entity.ActivityLog;
import com.antigravity.backend.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final ActivityLogRepository activityLogRepository;

    public void log(String action, String adminEmail, String targetUser, String details) {
        ActivityLog log = ActivityLog.builder()
                .action(action)
                .adminEmail(adminEmail)
                .targetUser(targetUser)
                .details(details)
                .build();
        activityLogRepository.save(log);
    }
}
