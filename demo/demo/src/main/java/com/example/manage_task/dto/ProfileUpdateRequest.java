package com.example.manage_task.dto;

import com.example.manage_task.custom_validation_annotation.ValidPhoneNumber;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @ValidPhoneNumber
    private String phone;
}
