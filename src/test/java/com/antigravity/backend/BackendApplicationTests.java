package com.antigravity.backend;

import com.antigravity.backend.entity.User;
import com.antigravity.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Optional;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void contextLoads() {
		System.out.println("=== REGISTERED DATABASE USERS ===");
		List<User> users = userRepository.findAll();
		if (users.isEmpty()) {
			System.out.println("No users found in database!");
		} else {
			for (User user : users) {
				System.out.printf("ID: %d | Name: %s | Email: %s | Role: %s | Active: %b\n",
						user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getActive());
			}
		}
		System.out.println("=================================");
	}

	@Test
	void resetAdminPassword() {
		String adminEmail = "admin@antigravity.com";
		String newPassword = "admin123";

		Optional<User> optUser = userRepository.findByEmail(adminEmail);
		if (optUser.isPresent()) {
			User user = optUser.get();
			user.setPassword(passwordEncoder.encode(newPassword));
			user.setRole("ADMIN");
			user.setActive(true);
			userRepository.save(user);
			System.out.println(">>> PASSWORD RESET SUCCESS for " + adminEmail + " => password is now: " + newPassword);
		} else {
			// Create the admin user if it doesn't exist
			User admin = User.builder()
					.fullName("Admin")
					.email(adminEmail)
					.password(passwordEncoder.encode(newPassword))
					.role("ADMIN")
					.active(true)
					.build();
			userRepository.save(admin);
			System.out.println(">>> ADMIN USER CREATED: " + adminEmail + " => password: " + newPassword);
		}
	}
}
