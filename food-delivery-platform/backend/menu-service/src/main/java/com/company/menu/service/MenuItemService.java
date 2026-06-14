package com.company.menu.service;
import com.company.menu.model.MenuItem;
import com.company.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MenuItemService {
    private final MenuItemRepository repository;
    public List<MenuItem> getByRestaurant(UUID restaurantId) { return repository.findByRestaurantId(restaurantId); }
    public MenuItem create(MenuItem m) { return repository.save(m); }
}
