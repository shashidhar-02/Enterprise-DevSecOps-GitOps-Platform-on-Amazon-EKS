package com.company.restaurant.service;
import com.company.restaurant.model.Restaurant;
import com.company.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository repository;
    public List<Restaurant> getAll() { return repository.findAll(); }
    public Restaurant create(Restaurant r) { return repository.save(r); }
}
