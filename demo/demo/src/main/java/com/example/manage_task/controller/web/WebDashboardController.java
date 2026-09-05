package com.example.manage_task.controller.web;

import com.example.manage_task.service.ProjectService;
import com.example.manage_task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller cho trang Dashboard (Thymeleaf Web UI).
 */
@Controller
@RequestMapping("/web")
@RequiredArgsConstructor
public class WebDashboardController {

    private final TaskService taskService;
    private final ProjectService projectService;

    @GetMapping({"/dashboard", "/"})
    public String dashboard(Model model) {
        // Lấy dữ liệu tổng quan cho dashboard
        var recentTasks = taskService.getAllTasks(PageRequest.of(0, 5));
        var recentProjects = projectService.getAllProjects(PageRequest.of(0, 5));

        model.addAttribute("recentTasks", recentTasks.getContent());
        model.addAttribute("totalTasks", recentTasks.getTotalElements());
        model.addAttribute("recentProjects", recentProjects.getContent());
        model.addAttribute("totalProjects", recentProjects.getTotalElements());
        model.addAttribute("completedToday", taskService.getCompletedTasksToday());
        model.addAttribute("dueSoonTasks", taskService.getTasksDueSoon());
        model.addAttribute("activePage", "dashboard");

        return "dashboard/index";
    }
}
