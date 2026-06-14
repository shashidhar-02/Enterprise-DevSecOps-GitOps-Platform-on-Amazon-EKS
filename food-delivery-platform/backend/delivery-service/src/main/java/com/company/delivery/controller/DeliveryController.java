package com.company.delivery.controller;
import com.company.delivery.model.Delivery;
import com.company.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Delivery.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/deliverys")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService service;

    @GetMapping
    public ResponseEntity<List<Delivery>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<Delivery> create(@RequestBody Delivery entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
