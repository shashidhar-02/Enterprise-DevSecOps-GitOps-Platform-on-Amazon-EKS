package com.company.analytics.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

/**
 * Entity representing a Metric.
 * Demonstrates Maintainability and Simplicity.
 */
@Entity
@Table(name = "metrics")
@Data
public class Metric {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
