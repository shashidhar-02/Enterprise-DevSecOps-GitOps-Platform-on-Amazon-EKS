package com.company.order.service;

import com.company.events.OrderCreatedEvent;
import com.company.order.dto.CreateOrderRequest;
import com.company.order.dto.OrderResponse;
import com.company.order.model.Order;
import com.company.order.repository.OrderRepository;
import com.company.shared.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaProducerService kafkaProducerService;

    public OrderResponse createOrder(UUID customerId, CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setRestaurantId(request.getRestaurantId());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(OrderStatus.PENDING.name());
        
        Order savedOrder = orderRepository.save(order);

        // Publish Event
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(savedOrder.getId())
                .customerId(customerId)
                .restaurantId(request.getRestaurantId())
                .totalAmount(request.getTotalAmount())
                .timestamp(System.currentTimeMillis())
                .build();
        
        kafkaProducerService.sendOrderCreatedEvent(event);

        return OrderResponse.builder()
                .id(savedOrder.getId())
                .status(savedOrder.getStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .build();
    }

    public OrderResponse getOrder(UUID customerId, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .build();
    }
}
