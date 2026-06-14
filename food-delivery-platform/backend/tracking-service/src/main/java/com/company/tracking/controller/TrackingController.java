package com.company.tracking.controller;
import com.company.tracking.model.Tracking;
import com.company.tracking.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Tracking.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/trackings")
@RequiredArgsConstructor
public class TrackingController {
    private final TrackingService service;

    @GetMapping
    public ResponseEntity<List<Tracking>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<Tracking> create(@RequestBody Tracking entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
