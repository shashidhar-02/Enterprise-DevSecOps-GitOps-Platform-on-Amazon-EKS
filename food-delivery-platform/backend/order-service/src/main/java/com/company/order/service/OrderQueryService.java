package com.company.order.service;

import com.company.order.dto.OrderResponseDto;
import com.company.order.entity.Order;
import com.company.order.exception.OrderNotFoundException;
import com.company.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderQueryService {
    private final OrderRepository orderRepository;

    public OrderResponseDto getOrderById(UUID id) {
        log.debug("Fetching order with id: {}", id);
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        return new OrderResponseDto(order.getId(), order.getStatus(), order.getAmount(), order.getPaymentMethod());
    }
}
