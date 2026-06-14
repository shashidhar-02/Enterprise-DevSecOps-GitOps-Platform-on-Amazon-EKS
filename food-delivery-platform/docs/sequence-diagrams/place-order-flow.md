```mermaid
sequenceDiagram
Customer->>Gateway: POST /orders
Gateway->>OrderService: Create Order
OrderService->>Kafka: OrderCreatedEvent
```