package com.example.manage_task.dto;

import lombok.Data;

@Data
public class LabelRequestDTO {
    private String name;
    private String color;
    private Long taskId;
}
