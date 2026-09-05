package com.example.manage_task.controller;

import com.example.manage_task.dto.LabelRequestDTO;
import com.example.manage_task.dto.LabelSearchRequest;
import com.example.manage_task.dto.ResponseDTO;
import com.example.manage_task.entity.Label;
import com.example.manage_task.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping
    public ResponseEntity<ResponseDTO<Page<Label>>> getAllLabels(Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(labelService.getAllLabels(pageable)));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ResponseDTO<Page<Label>>> getLabelsByTaskId(@PathVariable Long taskId, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(labelService.getLabelsByTaskId(taskId, pageable)));
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseDTO<Page<Label>>> searchLabels(@RequestBody LabelSearchRequest request, Pageable pageable) {
        return ResponseEntity.ok(ResponseDTO.success(labelService.searchLabels(request, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<Label>> getLabelById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseDTO.success(labelService.getLabelById(id)));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<Label>> createLabel(@Valid @RequestBody LabelRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.success(labelService.createLabel(requestDTO)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<Label>> updateLabel(@PathVariable Long id, @Valid @RequestBody LabelRequestDTO requestDTO) {
        return ResponseEntity.ok(ResponseDTO.success(labelService.updateLabel(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Void>> deleteLabel(@PathVariable Long id) {
        labelService.deleteLabel(id);
        return ResponseEntity.ok(ResponseDTO.success(null));
    }
}
