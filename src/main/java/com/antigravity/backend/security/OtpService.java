package com.antigravity.backend.security;

import com.antigravity.backend.entity.OtpVerification;
import com.antigravity.backend.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;

    public String generateOtp(String email) {
        // Generate a 6-digit OTP
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));

        // Expire in 10 minutes
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        OtpVerification verification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .expiryTime(expiry)
                .used(false)
                .build();

        otpVerificationRepository.save(verification);

        // Highlight OTP in console logs for developer testing
        System.out.println("=================================================");
        System.out.println("[OTP TRANSMISSION SYSTEM] - OUTGOING IDENTITY RECOVERY SIGNAL");
        System.out.println("TO: " + email);
        System.out.println("SECURITY VERIFICATION OTP: " + otp);
        System.out.println("EXPIRES IN: 10 minutes");
        System.out.println("=================================================");

        return otp;
    }

    public boolean checkOtp(String email, String otp) {
        return otpVerificationRepository
                .findFirstByEmailAndOtpAndUsedAndExpiryTimeAfterOrderByIdDesc(
                        email,
                        otp,
                        false,
                        LocalDateTime.now()
                )
                .isPresent();
    }

    public boolean verifyOtp(String email, String otp) {
        return otpVerificationRepository
                .findFirstByEmailAndOtpAndUsedAndExpiryTimeAfterOrderByIdDesc(
                        email,
                        otp,
                        false,
                        LocalDateTime.now()
                )
                .map(verification -> {
                    verification.setUsed(true);
                    otpVerificationRepository.save(verification);
                    return true;
                })
                .orElse(false);
    }
}
