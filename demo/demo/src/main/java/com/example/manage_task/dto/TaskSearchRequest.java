package com.example.manage_task.dto;

import com.example.manage_task.enums.TaskPriority;
import com.example.manage_task.enums.TaskStatus;
import lombok.Data;

@Data
public class TaskSearchRequest {
    private String keyword;
    private TaskStatus status;
    private TaskPriority priority;
    private Long projectId;
    private Long assigneeId;
}
