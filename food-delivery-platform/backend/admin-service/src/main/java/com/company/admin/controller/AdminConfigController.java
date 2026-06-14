package com.company.admin.controller;
import com.company.admin.model.AdminConfig;
import com.company.admin.service.AdminConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for AdminConfig.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminConfigController {
    private final AdminConfigService service;

    @GetMapping
    public ResponseEntity<List<AdminConfig>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<AdminConfig> create(@RequestBody AdminConfig entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
