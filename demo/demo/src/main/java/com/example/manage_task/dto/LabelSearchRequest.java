package com.example.manage_task.dto;

import lombok.Data;

@Data
public class LabelSearchRequest {
    private String keyword;
    private Long taskId;
}
