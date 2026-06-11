package com.antigravity.backend.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long admins;
    
    private List<Map<String, Object>> monthlyRegistrations;

    private long totalLogins;
    private long totalPasswordResets;
    private long totalRoleChanges;
}
