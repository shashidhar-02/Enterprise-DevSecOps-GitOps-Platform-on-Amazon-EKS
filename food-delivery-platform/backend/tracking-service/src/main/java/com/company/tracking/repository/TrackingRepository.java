package com.company.tracking.repository;
import com.company.tracking.model.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for Tracking.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface TrackingRepository extends JpaRepository<Tracking, UUID> {
}
