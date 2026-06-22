package com.antigravity.backend.controller;

import com.antigravity.backend.dto.AdminUpdateUserRequest;
import com.antigravity.backend.dto.AnalyticsResponse;
import com.antigravity.backend.entity.ActivityLog;
import com.antigravity.backend.entity.AuthLog;
import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.ActivityLogRepository;
import com.antigravity.backend.repository.AuthLogRepository;
import com.antigravity.backend.repository.UserRepository;
import com.antigravity.backend.security.JwtService;
import com.antigravity.backend.security.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final AuthLogRepository authLogRepository;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    private String extractAdminEmail(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtService.extractEmail(authHeader.substring(7));
        }
        return "System/Unknown";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String adminEmail = extractAdminEmail(authHeader);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String oldDetails = String.format("Name: %s, Email: %s, Role: %s, Active: %b",
                user.getFullName(), user.getEmail(), user.getRole(), user.getActive());

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail().trim());
        }
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            user.setRole(request.getRole().toUpperCase().trim());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        userRepository.save(user);

        String newDetails = String.format("Name: %s, Email: %s, Role: %s, Active: %b",
                user.getFullName(), user.getEmail(), user.getRole(), user.getActive());

        auditLogService.log("USER_UPDATE", adminEmail, user.getEmail(),
                "Modified user profile details. Old: [" + oldDetails + "], New: [" + newDetails + "]");

        return ResponseEntity.ok("User updated successfully");
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long id,
            @RequestParam String password,
            @RequestHeader("Authorization") String authHeader
    ) {
        String adminEmail = extractAdminEmail(authHeader);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        auditLogService.log("PASSWORD_RESET_BY_ADMIN", adminEmail, user.getEmail(), "Admin reset password for user");

        return ResponseEntity.ok("Password reset successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String adminEmail = extractAdminEmail(authHeader);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.deleteById(id);
        auditLogService.log("USER_DELETE", adminEmail, user.getEmail(), "Admin deleted user: " + user.getFullName());

        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeRole(
            @PathVariable Long id,
            @RequestParam String role,
            @RequestHeader("Authorization") String authHeader
    ) {
        String adminEmail = extractAdminEmail(authHeader);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String oldRole = user.getRole();
        user.setRole(role.toUpperCase().trim());
        userRepository.save(user);

        auditLogService.log("ROLE_CHANGE", adminEmail, user.getEmail(),
                "Changed user role from " + oldRole + " to " + role.toUpperCase().trim());

        return ResponseEntity.ok("Role updated to " + role.toUpperCase());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long id,
            @RequestParam Boolean active,
            @RequestHeader("Authorization") String authHeader
    ) {
        String adminEmail = extractAdminEmail(authHeader);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setActive(active);
        userRepository.save(user);

        String action = active ? "USER_ACTIVATE" : "USER_DEACTIVATE";
        auditLogService.log(action, adminEmail, user.getEmail(),
                active ? "Admin activated user account" : "Admin deactivated user account");

        return ResponseEntity.ok(active ? "User activated" : "User deactivated");
    }

    @GetMapping("/logs")
    public List<ActivityLog> getLogs() {
        return activityLogRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long inactiveUsers = userRepository.countByActive(false);
        long admins = userRepository.countByRole("ADMIN");

        long totalLogins = activityLogRepository.countByAction("LOGIN_SUCCESS");
        long totalPasswordResets = activityLogRepository.countByAction("PASSWORD_RESET_SUCCESS") 
                + activityLogRepository.countByAction("PASSWORD_RESET_BY_ADMIN");
        long totalRoleChanges = activityLogRepository.countByAction("ROLE_CHANGE");

        // Generate 6-month registration growth
        List<Map<String, Object>> monthlyRegistrations = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        LocalDateTime now = LocalDateTime.now();
        List<User> allUsers = userRepository.findAll();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthTime = now.minusMonths(i);
            String monthName = monthTime.format(formatter);
            int year = monthTime.getYear();

            long count = allUsers.stream().filter(u -> {
                if (u.getCreatedAt() == null) return false;
                return u.getCreatedAt().getMonth() == monthTime.getMonth() && u.getCreatedAt().getYear() == year;
            }).count();

            Map<String, Object> point = new HashMap<>();
            point.put("month", monthName);
            point.put("users", count);
            point.put("count", count);
            monthlyRegistrations.add(point);
        }

        AnalyticsResponse response = AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .admins(admins)
                .totalLogins(totalLogins)
                .totalPasswordResets(totalPasswordResets)
                .totalRoleChanges(totalRoleChanges)
                .monthlyRegistrations(monthlyRegistrations)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth-monitoring")
    public ResponseEntity<?> getAuthLogs(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) Boolean suspicious,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        List<AuthLog> logs;
        if (email != null && !email.isEmpty()) {
            logs = authLogRepository.findByEmailOrderByTimestampDesc(email);
        } else if (action != null && !action.isEmpty()) {
            logs = authLogRepository.findByActionOrderByTimestampDesc(action);
        } else if (suspicious != null && suspicious) {
            logs = authLogRepository.findBySuspiciousTrueOrderByTimestampDesc();
        } else if (from != null && to != null) {
            LocalDateTime start = LocalDateTime.parse(from);
            LocalDateTime end = LocalDateTime.parse(to);
            logs = authLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
        } else {
            logs = authLogRepository.findAllByOrderByTimestampDesc();
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/auth-monitoring/stats")
    public ResponseEntity<?> getAuthStats() {
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogins", authLogRepository.countByAction("LOGIN_SUCCESS"));
        stats.put("failedLogins", authLogRepository.countByAction("LOGIN_FAILED"));
        stats.put("logouts", authLogRepository.countByAction("LOGOUT"));
        stats.put("suspiciousEvents", authLogRepository.countBySuspiciousTrue());
        stats.put("logins24h", authLogRepository.countByActionAndTimestampAfter("LOGIN_SUCCESS", last24h));
        stats.put("failed24h", authLogRepository.countByActionAndTimestampAfter("LOGIN_FAILED", last24h));
        stats.put("activeUsers", authLogRepository.countDistinctActiveUsersSince(last24h));

        return ResponseEntity.ok(stats);
    }
}