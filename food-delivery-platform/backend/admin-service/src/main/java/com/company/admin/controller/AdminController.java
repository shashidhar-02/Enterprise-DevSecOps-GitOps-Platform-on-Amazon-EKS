package com.company.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        return ResponseEntity.ok(Map.of(
            "status", "HEALTHY",
            "activeOrders", 150,
            "activeRestaurants", 42
        ));
    }
}
