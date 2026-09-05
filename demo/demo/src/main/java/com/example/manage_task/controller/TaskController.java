package com.example.manage_task.controller;

import com.example.manage_task.dto.ResponseDTO;
import com.example.manage_task.dto.TaskRequestDTO;
import com.example.manage_task.dto.TaskSearchRequest;
import com.example.manage_task.entity.Task;
import com.example.manage_task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ResponseDTO<Page<Task>>> getAllTasks(Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(taskService.getAllTasks(pageable)));
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseDTO<Page<Task>>> searchTasks(@RequestBody TaskSearchRequest request, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(taskService.searchTasks(request, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<Task>> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseDTO.success(taskService.getTaskById(id)));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<Task>> createTask(@Valid @RequestBody TaskRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.success(taskService.createTask(requestDTO)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<Task>> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequestDTO requestDTO) {
        return ResponseEntity.ok(ResponseDTO.success(taskService.updateTask(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ResponseDTO.success(null));
    }
}
