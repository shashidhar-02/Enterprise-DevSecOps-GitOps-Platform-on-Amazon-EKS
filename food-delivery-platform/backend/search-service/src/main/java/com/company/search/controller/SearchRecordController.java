package com.company.search.controller;
import com.company.search.model.SearchRecord;
import com.company.search.service.SearchRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for SearchRecord.
 * Demonstrates Readability, Modularity, and Security (via endpoints).
 */
@RestController
@RequestMapping("/api/searchs")
@RequiredArgsConstructor
public class SearchRecordController {
    private final SearchRecordService service;

    @GetMapping
    public ResponseEntity<List<SearchRecord>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<SearchRecord> create(@RequestBody SearchRecord entity) {
        return ResponseEntity.status(201).body(service.save(entity));
    }
}
