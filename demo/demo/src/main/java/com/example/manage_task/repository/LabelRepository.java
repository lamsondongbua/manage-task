package com.example.manage_task.repository;

import com.example.manage_task.entity.Label;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {

    //tìm kiếm label theo task
    @Query("SELECT l FROM Label l JOIN l.tasks t WHERE t.id = :taskId")
    Page<Label> findbyTaskId(@Param("taskId") Long taskId, Pageable pageable);

    @Query("SELECT l FROM Label l LEFT JOIN l.tasks t WHERE " +
            "(:keyword IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:taskId IS NULL OR t.id = :taskId)")
    Page<Label> searchLabels(@Param("keyword") String keyword,
                             @Param("taskId") Long taskId,
                             Pageable pageable);
}
