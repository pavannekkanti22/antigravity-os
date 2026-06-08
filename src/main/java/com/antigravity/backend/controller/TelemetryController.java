package com.antigravity.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Random;

@RestController
public class TelemetryController {

    @GetMapping(value = "/api/telemetry/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE)

    public SseEmitter streamTelemetry() {

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        Random random = new Random();

        new Thread(() -> {

            try {

                while (true) {

                    int cpu = random.nextInt(40) + 40;

                    int memory = random.nextInt(30) + 50;

                    int nodes = random.nextInt(10) + 90;

                    String[] events = {
                            "AI optimization complete",
                            "Neural node initialized",
                            "Security layer synchronized",
                            "Telemetry uplink stable",
                            "Quantum cache refreshed"
                    };

                    String event =
                            events[random.nextInt(events.length)];

                    String json = String.format(
                            """
                            {
                              "cpu": %d,
                              "memory": %d,
                              "nodes": %d,
                              "event": "%s"
                            }
                            """,
                            cpu,
                            memory,
                            nodes,
                            event
                    );

                    emitter.send(
                            SseEmitter.event()
                                    .name("telemetry")
                                    .data(json)
                    );

                    Thread.sleep(2000);
                }

            } catch (IOException | InterruptedException e) {

                emitter.complete();
            }

        }).start();

        return emitter;
    }
}