package com.antigravity.backend.security;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.antigravity.backend.entity.ActivityLog;
import com.antigravity.backend.repository.ActivityLogRepository;
import com.antigravity.backend.security.JwtService;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final ActivityLogRepository activityLogRepository;
    private final JwtService jwtService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/api/telemetry/**"
                        )
                        .permitAll()
                        .requestMatchers(
                                "/api/settings/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable());
        http.addFilterBefore(
              jwtFilter,
              UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}