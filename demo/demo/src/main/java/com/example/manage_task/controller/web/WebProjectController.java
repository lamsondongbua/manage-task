package com.example.manage_task.controller.web;

import com.example.manage_task.dto.ProjectRequestDTO;
import com.example.manage_task.service.ProjectService;
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
 * Controller CRUD cho Project trong Thymeleaf Web UI.
 * Sử dụng lại ProjectService — không duplicate business logic.
 */
@Controller
@RequestMapping("/web/projects")
@RequiredArgsConstructor
public class WebProjectController {

    private final ProjectService projectService;

    @GetMapping
    public String listProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        var projectsPage = projectService.getAllProjects(pageable);

        model.addAttribute("projectsPage", projectsPage);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", projectsPage.getTotalPages());
        model.addAttribute("activePage", "projects");
        return "projects/list";
    }

    @GetMapping("/create")
    public String createProjectForm(Model model) {
        model.addAttribute("projectForm", new ProjectRequestDTO());
        model.addAttribute("activePage", "projects");
        return "projects/form";
    }

    @PostMapping("/create")
    public String createProject(
            @Valid @ModelAttribute("projectForm") ProjectRequestDTO projectForm,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("activePage", "projects");
            return "projects/form";
        }
        projectService.createProject(projectForm);
        redirectAttributes.addFlashAttribute("successMessage", "Project đã được tạo thành công!");
        return "redirect:/web/projects";
    }

    @GetMapping("/{id}/edit")
    public String editProjectForm(@PathVariable Long id, Model model) {
        var project = projectService.getProjectById(id);
        var projectForm = new ProjectRequestDTO();
        projectForm.setName(project.getName());
        projectForm.setDescription(project.getDescription());

        model.addAttribute("projectForm", projectForm);
        model.addAttribute("projectId", id);
        model.addAttribute("isEdit", true);
        model.addAttribute("activePage", "projects");
        return "projects/form";
    }

    @PostMapping("/{id}/edit")
    public String updateProject(
            @PathVariable Long id,
            @Valid @ModelAttribute("projectForm") ProjectRequestDTO projectForm,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("projectId", id);
            model.addAttribute("isEdit", true);
            model.addAttribute("activePage", "projects");
            return "projects/form";
        }
        projectService.updateProject(id, projectForm);
        redirectAttributes.addFlashAttribute("successMessage", "Project đã được cập nhật thành công!");
        return "redirect:/web/projects";
    }

    @PostMapping("/{id}/delete")
    public String deleteProject(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        projectService.deleteProject(id);
        redirectAttributes.addFlashAttribute("successMessage", "Project đã được xóa thành công!");
        return "redirect:/web/projects";
    }
}
