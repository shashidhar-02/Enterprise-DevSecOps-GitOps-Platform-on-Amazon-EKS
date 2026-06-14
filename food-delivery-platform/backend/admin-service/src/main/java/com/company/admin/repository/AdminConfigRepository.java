package com.company.admin.repository;
import com.company.admin.model.AdminConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for AdminConfig.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface AdminConfigRepository extends JpaRepository<AdminConfig, UUID> {
}
