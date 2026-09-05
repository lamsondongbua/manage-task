package com.example.manage_task.controller;

import com.example.manage_task.dto.ResponseDTO;
import com.example.manage_task.dto.UserRequestDTO;
import com.example.manage_task.dto.UserSearchRequest;
import com.example.manage_task.entity.User;
import com.example.manage_task.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ResponseDTO<Page<User>>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(userService.getAllUsers(pageable)));
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseDTO<Page<User>>> searchUsers(@RequestBody UserSearchRequest request, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(userService.searchUsers(request, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseDTO.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<User>> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO requestDTO) {
        return ResponseEntity.ok(ResponseDTO.success(userService.updateUser(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ResponseDTO.success(null));
    }
}
