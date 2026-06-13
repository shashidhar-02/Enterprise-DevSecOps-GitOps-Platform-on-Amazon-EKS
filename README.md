# CloudMart Application

This branch contains only the application code for the CloudMart ecommerce platform.

## Structure
```text
cloudmart-app/
├── frontend/
├── product-service/
├── cart-service/
├── order-service/
├── user-service/
├── database/
├── docker-compose.yml
├── README.md
└── docs/
```

## Purpose
- React frontend
- Backend API and business logic
- Database schema and seed data
- API documentation
- Unit tests

## Local run
- Install dependencies in `apps/backend` and `apps/frontend`.
- Run backend tests with `npm test`.
- Run frontend build with `npm run build`.
- Start the local app stack with `docker-compose up --build`.
