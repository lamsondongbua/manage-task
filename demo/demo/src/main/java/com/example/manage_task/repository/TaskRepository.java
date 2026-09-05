package com.example.manage_task.repository;

import com.example.manage_task.entity.Task;
import com.example.manage_task.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    //tasks của 1 project + phân trang
    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    //lọc theo status
    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);


    //load task kèo project + assignee (tránh N+1 queries)
    @Query("SELECT t FROM Task t " + "LEFT JOIN FETCH t.project LEFT JOIN FETCH t.user " + "WHERE t.id = :id")
    Optional<Task> findByIdWithDetails(@Param("id") Long id);
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);

    long countByStatusAndUpdatedAtBetween(TaskStatus status, OffsetDateTime start, OffsetDateTime end);

    long countByStatusNotAndDueDateBetween(TaskStatus status, LocalDate start, LocalDate end);

    @Query("SELECT t FROM Task t WHERE " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:assigneeId IS NULL OR t.user.id = :assigneeId)")
    Page<Task> searchTasks(@Param("keyword") String keyword, 
                           @Param("status") TaskStatus status, 
                           @Param("priority") com.example.manage_task.enums.TaskPriority priority, 
                           @Param("projectId") Long projectId, 
                           @Param("assigneeId") Long assigneeId, 
                           Pageable pageable);
}
