package com.antigravity.backend.controller;

import com.antigravity.backend.dto.UpdateProfileRequest;
import com.antigravity.backend.dto.ChangePasswordRequest;
import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;
import com.antigravity.backend.security.JwtService;
import com.antigravity.backend.security.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/api/profile/me")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("fullName", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("active", user.getActive());
        profile.put("avatar", user.getAvatar());
        profile.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/api/profile/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getAvatar() != null && !request.getAvatar().trim().isEmpty()) {
            user.setAvatar(request.getAvatar().trim());
        }

        userRepository.save(user);
        auditLogService.log("PROFILE_UPDATE", null, user.getEmail(), "Updated profile details: " + user.getFullName());

        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/api/profile/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String filename = "avatar_" + user.getId() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            Path filePath = dir.resolve(filename);
            file.transferTo(filePath.toFile());

            String avatarUrl = "/uploads/avatars/" + filename;

            Map<String, String> response = new HashMap<>();
            response.put("url", avatarUrl);

            auditLogService.log("AVATAR_UPLOAD", null, user.getEmail(), "Uploaded avatar: " + filename);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/api/profile/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChangePasswordRequest request
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            auditLogService.log("PASSWORD_CHANGE_FAILED", null, user.getEmail(), "Incorrect current password validation");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect current password.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be empty.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Confirm password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.log("PASSWORD_CHANGE_SUCCESS", null, user.getEmail(), "Password changed successfully from profile");

        return ResponseEntity.ok("Password updated successfully");
    }
}