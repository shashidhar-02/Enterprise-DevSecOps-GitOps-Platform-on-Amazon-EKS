package com.company.shared.constants;

public class AppConstants {
    private AppConstants() {
        // Prevent instantiation
    }

    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ROLE_HEADER = "X-User-Role";
    
    public static final String KAFKA_ORDER_TOPIC = "orders-topic";
    public static final String KAFKA_PAYMENT_TOPIC = "payments-topic";
    public static final String KAFKA_DELIVERY_TOPIC = "deliveries-topic";
}
