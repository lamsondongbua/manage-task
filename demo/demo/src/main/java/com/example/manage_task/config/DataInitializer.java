package com.example.manage_task.config;

import com.example.manage_task.entity.User;
import com.example.manage_task.enums.Role;
import com.example.manage_task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Tự động tạo tài khoản admin mặc định khi khởi động (nếu chưa có).
 * Tài khoản: admin@example.com / Admin@123
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@example.com";
    private static final String ADMIN_PASSWORD = "Admin@123";
    private static final String ADMIN_NAME = "Administrator";

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
            User admin = new User();
            admin.setName(ADMIN_NAME);
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            log.info("✅ Tài khoản admin mặc định đã được tạo: {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD);
        } else {
            log.info("ℹ️ Tài khoản admin đã tồn tại: {}", ADMIN_EMAIL);
        }
    }
}
