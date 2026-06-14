package com.company.review.service;
import com.company.review.model.Review;
import com.company.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for Review business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repository;

    @Transactional(readOnly = true)
    public List<Review> findAll() {
        log.info("Fetching all {}s", "Review");
        return repository.findAll();
    }

    @Transactional
    public Review save(Review entity) {
        log.info("Saving new {} with name: {}", "Review", entity.getName());
        return repository.save(entity);
    }
}
