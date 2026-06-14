```mermaid
sequenceDiagram
OrderService->>PaymentService: Process Payment
PaymentService->>OrderService: PaymentProcessedEvent
```