package com.antigravity.backend.controller;

import com.antigravity.backend.dto.AuthResponse;
import com.antigravity.backend.dto.LoginRequest;
import com.antigravity.backend.dto.RegisterRequest;
import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;
import com.antigravity.backend.security.JwtService;
import com.antigravity.backend.utils.PasswordUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(
                            "Email already exists",
                            "REGISTER_FAILED"
                    ));
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                //.role("USER") // Uncomment if role field exists
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        "User registered successfully",
                        "REGISTER_SUCCESS"
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid email",
                            "LOGIN_FAILED"
                    ));
        }

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            // Check if password matches legacy SHA-256 hashing
            if (PasswordUtil.verifyPassword(request.getPassword(), user.getPassword())) {
                passwordMatches = true;
                // Migrate the user password to BCrypt
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
            }
        }

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid password",
                            "LOGIN_FAILED"
                    ));
        }

        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        "Login successful",
                        token
                )
        );
    }
}