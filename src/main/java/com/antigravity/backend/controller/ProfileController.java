package com.antigravity.backend.controller;

import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;
import com.antigravity.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping("/api/profile/me")
    public Map<String, Object> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow();

        return Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "createdAt", user.getCreatedAt()
        );
    }
}