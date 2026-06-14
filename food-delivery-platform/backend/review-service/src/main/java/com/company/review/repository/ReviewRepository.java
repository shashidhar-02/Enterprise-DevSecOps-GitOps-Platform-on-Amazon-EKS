package com.company.review.repository;
import com.company.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for Review.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
}
