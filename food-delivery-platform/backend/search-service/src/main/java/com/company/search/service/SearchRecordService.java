package com.company.search.service;
import com.company.search.model.SearchRecord;
import com.company.search.repository.SearchRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for SearchRecord business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SearchRecordService {
    private final SearchRecordRepository repository;

    @Transactional(readOnly = true)
    public List<SearchRecord> findAll() {
        log.info("Fetching all {}s", "SearchRecord");
        return repository.findAll();
    }

    @Transactional
    public SearchRecord save(SearchRecord entity) {
        log.info("Saving new {} with name: {}", "SearchRecord", entity.getName());
        return repository.save(entity);
    }
}
