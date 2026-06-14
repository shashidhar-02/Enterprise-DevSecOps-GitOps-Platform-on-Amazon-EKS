package com.company.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAssignedEvent {
    private UUID deliveryId;
    private UUID orderId;
    private UUID driverId;
    private long timestamp;
}
