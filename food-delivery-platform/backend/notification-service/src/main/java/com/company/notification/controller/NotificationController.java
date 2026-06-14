package com.company.notification.controller;
import com.company.notification.model.Notification;
import com.company.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Notification.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
