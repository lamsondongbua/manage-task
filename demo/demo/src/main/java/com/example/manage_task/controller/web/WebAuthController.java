package com.example.manage_task.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller xử lý trang đăng nhập cho Thymeleaf Web UI.
 * Authentication thực sự được xử lý bởi Spring Security form login.
 */
@Controller
@RequestMapping("/web")
public class WebAuthController {

    @GetMapping("/login")
    public String loginPage(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            Model model
    ) {
        if (error != null) {
            model.addAttribute("errorMessage", "Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        }
        if (logout != null) {
            model.addAttribute("logoutMessage", "Bạn đã đăng xuất thành công.");
        }
        return "auth/login";
    }
}
