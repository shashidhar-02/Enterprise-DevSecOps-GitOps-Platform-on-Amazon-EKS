package com.company.tracking.service;
import com.company.tracking.model.Tracking;
import com.company.tracking.repository.TrackingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for Tracking business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TrackingService {
    private final TrackingRepository repository;

    @Transactional(readOnly = true)
    public List<Tracking> findAll() {
        log.info("Fetching all {}s", "Tracking");
        return repository.findAll();
    }

    @Transactional
    public Tracking save(Tracking entity) {
        log.info("Saving new {} with name: {}", "Tracking", entity.getName());
        return repository.save(entity);
    }
}
