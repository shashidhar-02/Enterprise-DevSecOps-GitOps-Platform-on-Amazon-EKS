package com.company.order.service;

import com.company.events.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "orders-topic";

    public void sendOrderCreatedEvent(OrderCreatedEvent event) {
        kafkaTemplate.send(TOPIC, event.getOrderId().toString(), event);
    }
}
