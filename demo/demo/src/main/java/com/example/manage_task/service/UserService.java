package com.example.manage_task.service;

import com.example.manage_task.dto.ProfileUpdateRequest;
import com.example.manage_task.dto.UserRequestDTO;
import com.example.manage_task.dto.UserSearchRequest;
import com.example.manage_task.entity.User;
import com.example.manage_task.enums.Role;
import com.example.manage_task.exception.ResourceNotFoundException;
import com.example.manage_task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> searchUsers(UserSearchRequest request, Pageable pageable) {
        return userRepository.searchUsers(request.getKeyword(), pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, UserRequestDTO requestDTO) {
        User user = getUserById(id);
        if (requestDTO.getName() != null) {
            user.setName(requestDTO.getName());
        }
        if (requestDTO.getEmail() != null) {
            user.setEmail(requestDTO.getEmail());
        }
        if (requestDTO.getRole() != null) {
            user.setRole(Role.valueOf(requestDTO.getRole()));
        }
        return userRepository.save(user);
    }

    public User updateProfile(Long id, ProfileUpdateRequest request) {
        User user = getUserById(id);
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        return userRepository.save(user);
    }
}
