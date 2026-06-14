package com.company.payment.service;

import com.company.payment.model.Payment;
import com.company.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(UUID orderId, double amount, String method) {
        log.info("Processing payment for order: {} amount: {}", orderId, amount);
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setStatus("COMPLETED");
        payment.setPaymentMethod(method);
        return paymentRepository.save(payment);
    }
}
