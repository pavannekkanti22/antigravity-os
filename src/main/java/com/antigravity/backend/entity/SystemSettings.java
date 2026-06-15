package com.antigravity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicationName;

    private String companyName;

    private String supportEmail;

    private Integer sessionTimeout;

    private Boolean maintenanceMode;

    private Boolean userRegistrationEnabled;

    private Integer passwordMinLength;
}