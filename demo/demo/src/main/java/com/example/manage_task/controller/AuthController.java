package com.example.manage_task.controller;

import com.example.manage_task.dto.AuthRequest;
import com.example.manage_task.dto.AuthResponse;
import com.example.manage_task.dto.RefreshTokenRequest;
import com.example.manage_task.dto.RegisterRequest;
import com.example.manage_task.dto.ResponseDTO;
import com.example.manage_task.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for registering, logging in, and refreshing tokens")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user", description = "Creates a new user account with strong password and optional phone validation")
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.success(authService.register(request)));
    }

    @Operation(summary = "Login user", description = "Authenticates a user and returns a JWT access token and a refresh token")
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<AuthResponse>> authenticate(
            @Valid @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(ResponseDTO.success(authService.authenticate(request)));
    }

    @Operation(summary = "Refresh access token", description = "Uses a valid refresh token to get a new JWT access token")
    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseDTO<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        return ResponseEntity.ok(ResponseDTO.success(authService.refreshToken(request.getRefreshToken())));
    }
}
