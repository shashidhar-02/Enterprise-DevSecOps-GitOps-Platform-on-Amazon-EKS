package com.company.delivery.repository;
import com.company.delivery.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for Delivery.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
}
