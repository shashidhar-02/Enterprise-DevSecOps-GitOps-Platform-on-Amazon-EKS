package com.company.notification.service;
import com.company.notification.model.Notification;
import com.company.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for Notification business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repository;

    @Transactional(readOnly = true)
    public List<Notification> findAll() {
        log.info("Fetching all {}s", "Notification");
        return repository.findAll();
    }

    @Transactional
    public Notification save(Notification entity) {
        log.info("Saving new {} with name: {}", "Notification", entity.getName());
        return repository.save(entity);
    }
}
