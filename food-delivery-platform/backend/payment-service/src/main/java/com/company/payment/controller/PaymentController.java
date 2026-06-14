package com.company.payment.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @GetMapping
    public String get() { return "Payment Service is running!"; }
}
