package com.company.admin.service;
import com.company.admin.model.AdminConfig;
import com.company.admin.repository.AdminConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for AdminConfig business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminConfigService {
    private final AdminConfigRepository repository;

    @Transactional(readOnly = true)
    public List<AdminConfig> findAll() {
        log.info("Fetching all {}s", "AdminConfig");
        return repository.findAll();
    }

    @Transactional
    public AdminConfig save(AdminConfig entity) {
        log.info("Saving new {} with name: {}", "AdminConfig", entity.getName());
        return repository.save(entity);
    }
}
