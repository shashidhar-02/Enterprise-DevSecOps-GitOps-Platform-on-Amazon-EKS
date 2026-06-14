package com.company.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateOrderRequest {
    private UUID restaurantId;
    private BigDecimal totalAmount;
    private List<ItemDto> items;

    @Data
    public static class ItemDto {
        private UUID menuItemId;
        private Integer quantity;
        private BigDecimal price;
    }
}
