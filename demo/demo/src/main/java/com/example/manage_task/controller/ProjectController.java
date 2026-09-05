package com.example.manage_task.controller;

import com.example.manage_task.dto.ProjectRequestDTO;
import com.example.manage_task.dto.ProjectSearchRequest;
import com.example.manage_task.dto.ResponseDTO;
import com.example.manage_task.entity.Project;
import com.example.manage_task.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ResponseDTO<Page<Project>>> getAllProjects(Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(projectService.getAllProjects(pageable)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseDTO<Page<Project>>> getProjectsByUserId(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(projectService.getProjectsByUserId(userId, pageable)));
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseDTO<Page<Project>>> searchProjects(@RequestBody ProjectSearchRequest request, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(projectService.searchProjects(request, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<Project>> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseDTO.success(projectService.getProjectById(id)));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<Project>> createProject(@Valid @RequestBody ProjectRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.success(projectService.createProject(requestDTO)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<Project>> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequestDTO requestDTO) {
        return ResponseEntity.ok(ResponseDTO.success(projectService.updateProject(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ResponseDTO.success(null));
    }
}
