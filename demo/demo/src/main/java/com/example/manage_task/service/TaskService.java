package com.example.manage_task.service;

import com.example.manage_task.dto.TaskRequestDTO;
import com.example.manage_task.dto.TaskSearchRequest;
import com.example.manage_task.entity.Task;
import com.example.manage_task.exception.ResourceNotFoundException;
import com.example.manage_task.repository.ProjectRepository;
import com.example.manage_task.repository.TaskRepository;
import com.example.manage_task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import com.example.manage_task.enums.TaskStatus;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Page<Task> getTasksByProjectId(Long projectId, Pageable pageable) {
        return taskRepository.findByProjectId(projectId, pageable);
    }

    public Page<Task> searchTasks(TaskSearchRequest request, Pageable pageable) {
        return taskRepository.searchTasks(
                request.getKeyword(),
                request.getStatus(),
                request.getPriority(),
                request.getProjectId(),
                request.getAssigneeId(),
                pageable
        );
    }

    public long getCompletedTasksToday() {
        OffsetDateTime startOfDay = OffsetDateTime.now().with(LocalTime.MIN);
        OffsetDateTime endOfDay = OffsetDateTime.now().with(LocalTime.MAX);
        return taskRepository.countByStatusAndUpdatedAtBetween(TaskStatus.DONE, startOfDay, endOfDay);
    }

    public long getTasksDueSoon() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);
        return taskRepository.countByStatusNotAndDueDateBetween(TaskStatus.DONE, today, threeDaysLater);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public Task createTask(TaskRequestDTO requestDTO) {
        var project = projectRepository.findById(requestDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + requestDTO.getProjectId()));
        
        Task task = new Task();
        task.setTitle(requestDTO.getTitle());
        task.setDescription(requestDTO.getDescription());
        task.setStatus(requestDTO.getStatus());
        task.setPriority(requestDTO.getPriority());
        task.setProject(project);
        task.setDueDate(requestDTO.getDueDate());


        if (requestDTO.getAssigneeId() != null) {
            var user = userRepository.findById(requestDTO.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getAssigneeId()));
            task.setUser(user);
        }

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional
    public Task updateTask(Long id, TaskRequestDTO requestDTO) {
        Task task = getTaskById(id);
        if (requestDTO.getTitle() != null) {
            task.setTitle(requestDTO.getTitle());
        }
        if (requestDTO.getDescription() != null) {
            task.setDescription(requestDTO.getDescription());
        }
        if (requestDTO.getStatus() != null) {
            task.setStatus(requestDTO.getStatus());
        }
        if (requestDTO.getPriority() != null) {
            task.setPriority(requestDTO.getPriority());
        }
        if (requestDTO.getDueDate() != null) {
            task.setDueDate(requestDTO.getDueDate());
        }
        
        if (requestDTO.getProjectId() != null) {
            var project = projectRepository.findById(requestDTO.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + requestDTO.getProjectId()));
            task.setProject(project);
        }

        if (requestDTO.getAssigneeId() != null) {
            var user = userRepository.findById(requestDTO.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getAssigneeId()));
            task.setUser(user);
        }

        return taskRepository.save(task);
    }
}
