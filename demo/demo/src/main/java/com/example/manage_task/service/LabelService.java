package com.example.manage_task.service;

import com.example.manage_task.dto.LabelRequestDTO;
import com.example.manage_task.dto.LabelSearchRequest;
import com.example.manage_task.entity.Label;
import com.example.manage_task.entity.Task;
import com.example.manage_task.exception.ResourceNotFoundException;
import com.example.manage_task.repository.LabelRepository;
import com.example.manage_task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;
    private final TaskRepository taskRepository;

    public Page<Label> getAllLabels(Pageable pageable) {
        return labelRepository.findAll(pageable);
    }

    public Page<Label> getLabelsByTaskId(Long taskId, Pageable pageable) {
        return labelRepository.findbyTaskId(taskId, pageable);
    }

    public Page<Label> searchLabels(LabelSearchRequest request, Pageable pageable) {
        return labelRepository.searchLabels(request.getKeyword(), request.getTaskId(), pageable);
    }

    public Label getLabelById(Long id) {
        return labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found with id: " + id));
    }

    @Transactional
    public Label createLabel(LabelRequestDTO dto) {
        Label label = new Label();
        label.setName(dto.getName());
        label.setColor(dto.getColor());

        if (dto.getTaskId() != null) {
            Task task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + dto.getTaskId()));
            label.getTasks().add(task); // ✅ thêm task vào danh sách
        }

        return labelRepository.save(label);
    }

    @Transactional
    public Label updateLabel(Long id, LabelRequestDTO dto) {
        Label label = getLabelById(id);

        if (dto.getName() != null) {
            label.setName(dto.getName());
        }
        if (dto.getColor() != null) {
            label.setColor(dto.getColor());
        }

        if (dto.getTaskId() != null) {
            Task task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + dto.getTaskId()));
            // chỉ thêm nếu chưa có trong danh sách
            if (!label.getTasks().contains(task)) {
                label.getTasks().add(task); // ✅
            }
        }

        return labelRepository.save(label);
    }

    @Transactional
    public void deleteLabel(Long id) {
        labelRepository.deleteById(id);
    }
}