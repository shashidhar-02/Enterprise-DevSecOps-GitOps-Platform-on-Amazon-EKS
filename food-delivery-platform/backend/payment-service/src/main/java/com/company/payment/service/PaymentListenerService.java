package com.company.payment.service;
import com.company.payment.model.Payment;
import com.company.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentListenerService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentListenerService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "orders-topic", groupId = "payment-group")
    public void handleOrderCreated(String eventJson) {
        logger.info("Processing payment for event: {}", eventJson);
        Payment p = new Payment();
        p.setStatus("COMPLETED");
        paymentRepository.save(p);
        
        kafkaTemplate.send("payments-topic", "{\"paymentId\": \"" + p.getId() + "\", \"status\": \"COMPLETED\"}");
    }
}
