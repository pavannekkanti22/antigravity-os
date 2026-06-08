package com.antigravity.backend.controller;

import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        userRepository.deleteById(id);

        return "User deleted successfully";
    }
    @PutMapping("/users/{id}/role")
    public String changeRole(
            @PathVariable Long id,
            @RequestParam String role
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setRole(role.toUpperCase());

        userRepository.save(user);

        return "Role updated to " + role.toUpperCase();
    }
    @PutMapping("/users/{id}/status")
    public String changeStatus(
            @PathVariable Long id,
            @RequestParam Boolean active
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setActive(active);

        userRepository.save(user);

        return active
                ? "User activated"
                : "User deactivated";
    }
}