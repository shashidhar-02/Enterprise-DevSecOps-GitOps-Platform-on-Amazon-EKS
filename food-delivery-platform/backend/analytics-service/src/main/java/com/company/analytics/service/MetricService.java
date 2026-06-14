package com.company.analytics.service;
import com.company.analytics.model.Metric;
import com.company.analytics.repository.MetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for Metric business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MetricService {
    private final MetricRepository repository;

    @Transactional(readOnly = true)
    public List<Metric> findAll() {
        log.info("Fetching all {}s", "Metric");
        return repository.findAll();
    }

    @Transactional
    public Metric save(Metric entity) {
        log.info("Saving new {} with name: {}", "Metric", entity.getName());
        return repository.save(entity);
    }
}
