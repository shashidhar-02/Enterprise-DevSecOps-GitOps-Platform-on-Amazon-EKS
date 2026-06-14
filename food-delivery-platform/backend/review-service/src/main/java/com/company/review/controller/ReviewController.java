package com.company.review.controller;
import com.company.review.model.Review;
import com.company.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Review.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @GetMapping
    public ResponseEntity<List<Review>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<Review> create(@RequestBody Review entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
