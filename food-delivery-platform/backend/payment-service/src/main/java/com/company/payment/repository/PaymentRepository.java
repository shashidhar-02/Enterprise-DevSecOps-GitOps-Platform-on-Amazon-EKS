package com.company.payment.repository;
import com.company.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface PaymentRepository extends JpaRepository<Payment, UUID> {}
