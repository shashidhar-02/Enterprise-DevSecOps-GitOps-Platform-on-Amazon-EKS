package com.company.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class OrderResponse {
    private UUID id;
    private String status;
    private BigDecimal totalAmount;
}
