package com.example.manage_task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> {
    private String errorCode;
    private String errorMessage;
    private T data;

    public static <T> ResponseDTO<T> success(T data) {
        return ResponseDTO.<T>builder()
                .errorCode("0")
                .errorMessage("Success")
                .data(data)
                .build();
    }

    public static <T> ResponseDTO<T> error(String errorCode, String errorMessage) {
        return ResponseDTO.<T>builder()
                .errorCode(errorCode)
                .errorMessage(errorMessage)
                .data(null)
                .build();
    }
}
