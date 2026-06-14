package com.company.analytics.repository;
import com.company.analytics.model.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for Metric.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface MetricRepository extends JpaRepository<Metric, UUID> {
}
