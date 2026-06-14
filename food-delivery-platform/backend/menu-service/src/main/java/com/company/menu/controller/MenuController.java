package com.company.menu.controller;

import com.company.menu.model.MenuItem;
import com.company.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {
    private final MenuItemRepository repository;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<MenuItem> create(@RequestBody MenuItem item) {
        return ResponseEntity.ok(repository.save(item));
    }
}
