package com.company.order.service;

import com.company.order.dto.CreateOrderDto;
import com.company.order.dto.OrderResponseDto;
import com.company.order.entity.Order;
import com.company.order.repository.OrderRepository;
import com.company.order.config.KafkaConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderCommandService {
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public OrderResponseDto createOrder(CreateOrderDto dto) {
        log.info("Creating new order for user: {}", dto.getUserId());
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setRestaurantId(dto.getRestaurantId());
        order.setStatus("CREATED");
        order.setAmount(dto.getAmount());
        order.setPaymentMethod(dto.getPaymentMethod());
        
        Order savedOrder = orderRepository.save(order);
        
        // Publish Event
        kafkaTemplate.send(KafkaConfig.ORDER_CREATED_TOPIC, savedOrder.getId().toString(), savedOrder);
        log.info("Order created successfully: {}", savedOrder.getId());
        
        return new OrderResponseDto(savedOrder.getId(), savedOrder.getStatus(), savedOrder.getAmount(), savedOrder.getPaymentMethod());
    }
}
