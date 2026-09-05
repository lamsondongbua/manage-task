package com.example.manage_task.repository;

import com.example.manage_task.entity.Project;
import com.example.manage_task.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    //search project theo user
    Page<Project> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:userId IS NULL OR p.user.id = :userId)")
    Page<Project> searchProjects(@Param("keyword") String keyword, @Param("userId") Long userId, Pageable pageable);
}
