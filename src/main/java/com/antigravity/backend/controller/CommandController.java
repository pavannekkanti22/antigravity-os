package com.antigravity.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
public class CommandController {

    @PostMapping("/api/command/execute")
    public ResponseEntity<?> executeCommand(@RequestBody Map<String, String> request) {
        String commandInput = request.get("command");
        if (commandInput == null || commandInput.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("output", "Error: Empty command."));
        }

        commandInput = commandInput.trim().toLowerCase();
        String output = "";
        boolean success = true;

        if (commandInput.equals("/help")) {
            output = "AVAILABLE COMMANDS:\n" +
                     "  /help                Display list of console command nodes.\n" +
                     "  /diagnose            Run a complete quantum health diagnosis.\n" +
                     "  /optimize            Trigger cognitive database & memory optimization.\n" +
                     "  /ai-mode [on/off]    Enable or disable autopilot AI agent assistance.\n" +
                     "  /system-logs         Stream recent kernel logs from central node.\n" +
                     "  /clear               Clear console screen.";
        } else if (commandInput.equals("/diagnose")) {
            output = "DIAGNOSTIC STATUS: EXCELLENT\n" +
                     "--------------------------------------------------\n" +
                     "  [OK]  H2 Database Connector: Operational (latency: 1.2ms)\n" +
                     "  [OK]  Spring Web Core Service: Active (port 8081)\n" +
                     "  [OK]  Memory Heap: 342MB / 1024MB allocated\n" +
                     "  [OK]  CORS Web Policy: Authorized (React port 5173)\n" +
                     "  [OK]  Neural Engine core status: Sync 99.4%\n" +
                     "  [OK]  Quantum cooling system: 1.2 Kelvin\n" +
                     "--------------------------------------------------\n" +
                     "Overall Integrity Index: 98.6%";
        } else if (commandInput.equals("/optimize")) {
            output = "STARTING SYSTEM OPTIMIZATION...\n" +
                     "  > Initializing cognitive garbage collector...\n" +
                     "  > Defragmenting memory buffer pools...\n" +
                     "  > Indexing database user constraints...\n" +
                     "  > Dynamic throttle adjustment applied to HTTP pipelines...\n" +
                     "SYSTEM SECURED & OPTIMIZED\n" +
                     "  * Latency decreased by 18.2ms\n" +
                     "  * Memory footprint reduced by 85MB\n" +
                     "  * CPU utilization stabilized.";
        } else if (commandInput.startsWith("/ai-mode")) {
            String[] parts = commandInput.split("\\s+");
            if (parts.length > 1 && (parts[1].equals("on") || parts[1].equals("true"))) {
                output = "AUTO-PILOT INTERFACE: ENABLED\n" +
                         "Antigravity Intelligence has taken control of operational heuristics.";
            } else if (parts.length > 1 && (parts[1].equals("off") || parts[1].equals("false"))) {
                output = "AUTO-PILOT INTERFACE: DISABLED\n" +
                         "Command returned to manual commander control.";
            } else {
                output = "Usage: /ai-mode [on/off]\n" +
                         "Current State: ACTIVE (Autopilot on background tracking)";
            }
        } else if (commandInput.equals("/system-logs")) {
            output = "SYS-LOGS [SECURE CORE]\n" +
                     "  [2026-05-26 14:52:10] INFO  - User registration request parsed\n" +
                     "  [2026-05-26 14:52:12] DEBUG - Handshake established with Client React V19\n" +
                     "  [2026-05-26 14:53:01] WARN  - Slow response from external API: bypassed\n" +
                     "  [2026-05-26 14:55:40] INFO  - Telemetry SseEmitter initialized at index 0x9f912\n" +
                     "  [2026-05-26 14:57:08] INFO  - Optimizer ran successfully";
        } else {
            success = false;
            output = "Command not recognized: '" + commandInput + "'\n" +
                     "Type /help to see the list of valid commands.";
        }

        return ResponseEntity.ok(Map.of(
                "command", commandInput,
                "output", output,
                "success", success,
                "timestamp", new Date().getTime()
        ));
    }
}
