package com.company.search.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

/**
 * Entity representing a SearchRecord.
 * Demonstrates Maintainability and Simplicity.
 */
@Entity
@Table(name = "searchrecords")
@Data
public class SearchRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
