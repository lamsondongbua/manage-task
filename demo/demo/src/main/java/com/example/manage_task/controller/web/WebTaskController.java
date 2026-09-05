package com.example.manage_task.controller.web;

import com.example.manage_task.dto.TaskRequestDTO;
import com.example.manage_task.enums.TaskPriority;
import com.example.manage_task.enums.TaskStatus;
import com.example.manage_task.service.ProjectService;
import com.example.manage_task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controller CRUD cho Task trong Thymeleaf Web UI.
 * Sử dụng lại TaskService — không duplicate business logic.
 */
@Controller
@RequestMapping("/web/tasks")
@RequiredArgsConstructor
public class WebTaskController {

    private final TaskService taskService;
    private final ProjectService projectService;

    @GetMapping
    public String listTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        var tasksPage = taskService.getAllTasks(pageable);

        model.addAttribute("tasksPage", tasksPage);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", tasksPage.getTotalPages());
        model.addAttribute("activePage", "tasks");
        return "tasks/list";
    }

    @GetMapping("/{id}")
    public String taskDetail(@PathVariable Long id, Model model) {
        var task = taskService.getTaskById(id);
        System.out.println("createdAt = " + task.getCreatedAt());
        System.out.println("updatedAt = " + task.getUpdatedAt());
        System.out.println("offset = " + task.getCreatedAt().getOffset());
        model.addAttribute("task", task);
        model.addAttribute("activePage", "tasks");
        return "tasks/detail";
    }

    @GetMapping("/create")
    public String createTaskForm(Model model) {
        model.addAttribute("taskForm", new TaskRequestDTO());
        model.addAttribute("projects", projectService.getAllProjects(PageRequest.of(0, 100)).getContent());
        model.addAttribute("statuses", TaskStatus.values());
        model.addAttribute("priorities", TaskPriority.values());
        model.addAttribute("activePage", "tasks");
        return "tasks/form";
    }

    @PostMapping("/create")
    public String createTask(
            @Valid @ModelAttribute("taskForm") TaskRequestDTO taskForm,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("projects", projectService.getAllProjects(PageRequest.of(0, 100)).getContent());
            model.addAttribute("statuses", TaskStatus.values());
            model.addAttribute("priorities", TaskPriority.values());
            model.addAttribute("activePage", "tasks");
            return "tasks/form";
        }
        taskService.createTask(taskForm);
        redirectAttributes.addFlashAttribute("successMessage", "Task đã được tạo thành công!");
        return "redirect:/web/tasks";
    }

    @GetMapping("/{id}/edit")
    public String editTaskForm(@PathVariable Long id, Model model) {
        var task = taskService.getTaskById(id);
        // Map entity sang DTO cho form
        var taskForm = new TaskRequestDTO();
        taskForm.setTitle(task.getTitle());
        taskForm.setDescription(task.getDescription());
        taskForm.setStatus(task.getStatus());
        taskForm.setPriority(task.getPriority());
        taskForm.setDueDate(task.getDueDate());
        if (task.getProject() != null) taskForm.setProjectId(task.getProject().getId());
        if (task.getUser() != null) taskForm.setAssigneeId(task.getUser().getId());

        model.addAttribute("taskForm", taskForm);
        model.addAttribute("taskId", id);
        model.addAttribute("projects", projectService.getAllProjects(PageRequest.of(0, 100)).getContent());
        model.addAttribute("statuses", TaskStatus.values());
        model.addAttribute("priorities", TaskPriority.values());
        model.addAttribute("isEdit", true);
        model.addAttribute("activePage", "tasks");
        return "tasks/form";
    }

    @PostMapping("/{id}/edit")
    public String updateTask(
            @PathVariable Long id,
            @Valid @ModelAttribute("taskForm") TaskRequestDTO taskForm,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("taskId", id);
            model.addAttribute("projects", projectService.getAllProjects(PageRequest.of(0, 100)).getContent());
            model.addAttribute("statuses", TaskStatus.values());
            model.addAttribute("priorities", TaskPriority.values());
            model.addAttribute("isEdit", true);
            model.addAttribute("activePage", "tasks");
            return "tasks/form";
        }
        taskService.updateTask(id, taskForm);
        redirectAttributes.addFlashAttribute("successMessage", "Task đã được cập nhật thành công!");
        return "redirect:/web/tasks";
    }

    @PostMapping("/{id}/delete")
    public String deleteTask(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        taskService.deleteTask(id);
        redirectAttributes.addFlashAttribute("successMessage", "Task đã được xóa thành công!");
        return "redirect:/web/tasks";
    }
}
