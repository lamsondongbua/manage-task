package com.example.manage_task.service;

import com.example.manage_task.dto.ProjectRequestDTO;
import com.example.manage_task.dto.ProjectSearchRequest;
import com.example.manage_task.entity.Project;
import com.example.manage_task.entity.User;
import com.example.manage_task.exception.ResourceNotFoundException;
import com.example.manage_task.exception.UnauthorizedException;
import com.example.manage_task.repository.ProjectRepository;
import com.example.manage_task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Page<Project> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    public Page<Project> getProjectsByUserId(Long userId, Pageable pageable) {
        return projectRepository.findByUserId(userId, pageable);
    }

    public Page<Project> searchProjects(ProjectSearchRequest request, Pageable pageable) {
        return projectRepository.searchProjects(request.getKeyword(), request.getUserId(), pageable);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(ProjectRequestDTO projectRequestDTO) {
        Project project = new Project();
        project.setName(projectRequestDTO.getName());
        project.setDescription(projectRequestDTO.getDescription());
        // owner_id là NOT NULL trong DB -> luôn gán user đang đăng nhập làm chủ sở hữu
        project.setUser(getCurrentUser());
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectRequestDTO dto) {
        Project project = getProjectById(id);
        if (dto.getName() != null) {
            project.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            project.setDescription(dto.getDescription());
        }
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    /**
     * Lấy user đang đăng nhập từ SecurityContext. Dùng chung cho REST API (JWT) và web form login —
     * cả hai chain đều đặt principal name là email của user.
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Bạn cần đăng nhập để thực hiện thao tác này");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException(
                        "Không tìm thấy user đang đăng nhập: " + authentication.getName()));
    }
}
