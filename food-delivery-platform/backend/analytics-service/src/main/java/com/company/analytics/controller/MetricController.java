package com.company.analytics.controller;
import com.company.analytics.model.Metric;
import com.company.analytics.service.MetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Metric.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/analyticss")
@RequiredArgsConstructor
public class MetricController {
    private final MetricService service;

    @GetMapping
    public ResponseEntity<List<Metric>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<Metric> create(@RequestBody Metric entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
