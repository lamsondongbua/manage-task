package com.example.manage_task.dto;

import lombok.Data;

@Data
public class ProjectSearchRequest {
    private String keyword;
    private Long userId;
}
