package com.company.payment.service;
import com.company.payment.model.Payment;
import com.company.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentListenerService {
    private final PaymentRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "orders-topic", groupId = "payment-group")
    public void handleOrderCreated(String eventJson) {
        // Mock processing OrderCreatedEvent
        System.out.println("Processing payment for event: " + eventJson);
        Payment p = new Payment();
        p.setStatus("COMPLETED");
        repository.save(p);
        kafkaTemplate.send("payments-topic", "{\"paymentId\": \"" + p.getId() + "\", \"status\": \"COMPLETED\"}");
    }
}
