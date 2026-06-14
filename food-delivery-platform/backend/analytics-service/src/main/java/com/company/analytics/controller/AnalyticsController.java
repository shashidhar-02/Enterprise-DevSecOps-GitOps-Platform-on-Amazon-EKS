package com.company.analytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    
    @GetMapping("/daily-revenue")
    public ResponseEntity<Map<String, Double>> getDailyRevenue() {
        return ResponseEntity.ok(Map.of("revenue", 12500.50));
    }
}
