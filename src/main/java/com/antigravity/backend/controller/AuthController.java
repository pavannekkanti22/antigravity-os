package com.antigravity.backend.controller;

import com.antigravity.backend.dto.*;
import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;
import com.antigravity.backend.security.JwtService;
import com.antigravity.backend.security.AuditLogService;
import com.antigravity.backend.security.OtpService;
import com.antigravity.backend.utils.PasswordUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final OtpService otpService;

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
                .role("USER")
                .active(true)
                .build();

        userRepository.save(user);

        auditLogService.log("REGISTER_SUCCESS", null, user.getEmail(), "Identity registered: " + user.getFullName());

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
            auditLogService.log("LOGIN_FAILED", null, request.getEmail(), "Invalid email credential signal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid email",
                            "LOGIN_FAILED"
                    ));
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            auditLogService.log("LOGIN_FAILED", null, user.getEmail(), "Blocked login for deactivated account");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new AuthResponse(
                            "Account is deactivated. Contact Administrator.",
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
            auditLogService.log("LOGIN_FAILED", null, user.getEmail(), "Invalid password credential signal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid password",
                            "LOGIN_FAILED"
                    ));
        }

        String token = jwtService.generateToken(user.getEmail());

        auditLogService.log("LOGIN_SUCCESS", null, user.getEmail(), "User logged in and established secure session");

        return ResponseEntity.ok(
                new AuthResponse(
                        "Login successful",
                        token
                )
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            // Standard safety response to prevent user enumeration
            return ResponseEntity.ok(Map.of(
                    "message", "If the credentials match a system identity, a recovery key will be generated.",
                    "code", "OTP_SENT"
            ));
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message", "Cannot recover access for deactivated accounts.",
                            "code", "ACCOUNT_DISABLED"
                    ));
        }

        String otp = otpService.generateOtp(user.getEmail());
        auditLogService.log("PASSWORD_RESET_REQUEST", null, user.getEmail(), "Recovery OTP key generated");

        return ResponseEntity.ok(Map.of(
                "message", "OTP generated successfully and emitted to console.",
                "code", "OTP_SENT"
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.checkOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            auditLogService.log("OTP_VERIFICATION_FAILED", null, request.getEmail(), "Provided invalid or expired OTP verification code");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Invalid or expired verification signal.",
                            "code", "OTP_INVALID"
                    ));
        }

        auditLogService.log("OTP_VERIFICATION_SUCCESS", null, request.getEmail(), "OTP verified successfully");
        return ResponseEntity.ok(Map.of(
                "message", "OTP verified. Connection is ready for override signal.",
                "code", "OTP_VERIFIED"
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            auditLogService.log("PASSWORD_RESET_FAILED", null, request.getEmail(), "Attempted to reset password with invalid OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Identity verification failed. Invalid or expired OTP.",
                            "code", "RESET_FAILED"
                    ));
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "User not found.",
                            "code", "RESET_FAILED"
                    ));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.log("PASSWORD_RESET_SUCCESS", null, user.getEmail(), "Password reset successfully using OTP");

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully. Access restored.",
                "code", "RESET_SUCCESS"
        ));
    }
}