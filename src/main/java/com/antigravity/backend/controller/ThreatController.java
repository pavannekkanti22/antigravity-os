package com.antigravity.backend.controller;

import com.antigravity.backend.entity.ActivityLog;
import com.antigravity.backend.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/threats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ThreatController {

    private final ActivityLogRepository activityLogRepository;

    @GetMapping
    public Map<String, Object> getThreatData() {

        List<ActivityLog> logs =
                activityLogRepository.findAll();

        long failedLogins = logs.stream()
                .filter(log ->
                        log.getAction()
                                .toLowerCase()
                                .contains("failed"))
                .count();

        long passwordResets = logs.stream()
                .filter(log ->
                        log.getAction()
                                .toLowerCase()
                                .contains("password"))
                .count();

        long roleChanges = logs.stream()
                .filter(log ->
                        log.getAction()
                                .toLowerCase()
                                .contains("role"))
                .count();

        Map<String, Object> response =
                new HashMap<>();

        response.put("failedLogins", failedLogins);
        response.put("passwordResets", passwordResets);
        response.put("roleChanges", roleChanges);
        response.put("blockedUsers", 0);
        response.put("securityScore", 98);

        return response;
    }
}