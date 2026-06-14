package com.company.restaurant.repository;
import com.company.restaurant.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {}
