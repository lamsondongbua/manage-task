package com.example.manage_task.controller.web;

import com.example.manage_task.dto.ProfileUpdateRequest;
import com.example.manage_task.entity.User;
import com.example.manage_task.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/web/profile")
@RequiredArgsConstructor
public class WebProfileController {

    private final UserService userService;

    @GetMapping
    public String viewProfile(@AuthenticationPrincipal User currentUser, Model model) {
        // Lấy lại user mới nhất từ DB
        User user = userService.getUserById(currentUser.getId());
        
        if (!model.containsAttribute("profileRequest")) {
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setName(user.getName());
            request.setPhone(user.getPhone());
            model.addAttribute("profileRequest", request);
        }
        
        model.addAttribute("user", user);
        model.addAttribute("activePage", "profile");
        return "profile/index";
    }

    @PostMapping("/update")
    public String updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @ModelAttribute("profileRequest") ProfileUpdateRequest request,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.profileRequest", bindingResult);
            redirectAttributes.addFlashAttribute("profileRequest", request);
            redirectAttributes.addFlashAttribute("errorMessage", "Vui lòng kiểm tra lại thông tin nhập.");
            return "redirect:/web/profile";
        }

        try {
            userService.updateProfile(currentUser.getId(), request);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật hồ sơ thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi khi cập nhật hồ sơ: " + e.getMessage());
        }

        return "redirect:/web/profile";
    }
}
