package com.company.tracking.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

/**
 * Entity representing a Tracking.
 * Demonstrates Maintainability and Simplicity.
 */
@Entity
@Table(name = "trackings")
@Data
public class Tracking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
