package com.company.search.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {
    
    @GetMapping
    public ResponseEntity<List<String>> search(@RequestParam String query) {
        return ResponseEntity.ok(List.of("Result 1 for " + query, "Result 2 for " + query));
    }
}
