package com.company.menu.controller;
import com.company.menu.model.MenuItem;
import com.company.menu.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuItemController {
    private final MenuItemService service;
    @GetMapping("/{restaurantId}")
    public List<MenuItem> getMenu(@PathVariable UUID restaurantId) { return service.getByRestaurant(restaurantId); }
    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem m) { return service.create(m); }
}
