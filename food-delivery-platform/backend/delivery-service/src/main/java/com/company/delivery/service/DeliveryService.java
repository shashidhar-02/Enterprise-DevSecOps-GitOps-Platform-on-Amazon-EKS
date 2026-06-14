package com.company.delivery.service;
import com.company.delivery.model.Delivery;
import com.company.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for Delivery business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository repository;

    @Transactional(readOnly = true)
    public List<Delivery> findAll() {
        log.info("Fetching all {}s", "Delivery");
        return repository.findAll();
    }

    @Transactional
    public Delivery save(Delivery entity) {
        log.info("Saving new {} with name: {}", "Delivery", entity.getName());
        return repository.save(entity);
    }
}
