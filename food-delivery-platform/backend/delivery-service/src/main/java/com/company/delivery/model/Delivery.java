package com.company.delivery.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

/**
 * Entity representing a Delivery.
 * Demonstrates Maintainability and Simplicity.
 */
@Entity
@Table(name = "deliverys")
@Data
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
