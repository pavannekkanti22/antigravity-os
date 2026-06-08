package com.antigravity.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSecureController {

    @GetMapping("/api/secure/test")
    public String test() {

        return "JWT VERIFIED SUCCESSFULLY";
    }
}