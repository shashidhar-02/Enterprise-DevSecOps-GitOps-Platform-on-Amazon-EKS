package com.company.order.controller;

import com.company.order.dto.CreateOrderRequest;
import com.company.order.dto.OrderResponse;
import com.company.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestHeader("X-User-Id") String userId,
                                                     @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(UUID.fromString(userId), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@RequestHeader("X-User-Id") String userId,
                                                  @PathVariable UUID orderId) {
        OrderResponse response = orderService.getOrder(UUID.fromString(userId), orderId);
        return ResponseEntity.ok(response);
    }
}
