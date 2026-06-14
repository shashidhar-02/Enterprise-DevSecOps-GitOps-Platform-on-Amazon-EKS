package com.company.notification.repository;
import com.company.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for Notification.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
}
