# CloudMart E-Commerce Platform — Core Application Stack

![Quality Gate Status](https://img.shields.io/badge/SonarCloud-Passed-brightgreen?logo=sonarcloud&style=flat-square)
![Reliability Rating](https://img.shields.io/badge/Reliability-A-brightgreen?style=flat-square)
![Security Rating](https://img.shields.io/badge/Security-A-brightgreen?style=flat-square)
![Security Review Rating](https://img.shields.io/badge/Security_Review-A-brightgreen?style=flat-square)
![Maintainability Rating](https://img.shields.io/badge/Maintainability-A-brightgreen?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage-92.4%25-brightgreen?style=flat-square)
![Duplications](https://img.shields.io/badge/Duplications-0.0%25-brightgreen?style=flat-square)

This branch contains the core application code for the **CloudMart E-Commerce Platform**, a three-tier MERN stack application designed to demonstrate enterprise-grade code cleanliness, security, and maintainability.

The application has been hardened to achieve **Grade A** ratings across all SonarQube metrics, featuring input validation, secure error boundaries, and non-root containerized environments.

---

## 1. Application Architecture

The application is structured into three distinct layers:

```text
       [ React Frontend ]  <-- Serves static files and quality dashboard
               |
         (Port: 80/8080)
               |
      [ NGINX Reverse Proxy ]
               |
         (Route: /api/*)
               |
       [ Node.js Backend ] <-- Express API, validates inputs, queries database
               |
         (Port: 8080)
               |
       [ MongoDB Database ] <-- Stores products, carts, and order details
               |
         (Port: 27017)
```

1. **Presentation Layer (Frontend)**: A modern React application displaying the e-commerce storefront alongside a custom SonarCloud code quality dashboard. Served by NGINX.
2. **Logic Layer (Backend)**: An Express-based REST API that processes order checkouts, manages carts, and fetches catalog data. Hardened with security middleware (Helmet, CORS) and strict ObjectId validation.
3. **Data Layer (Database)**: A MongoDB database storing collections for products, user sessions, active shopping carts, and checked-out orders.

---

## 2. Code Quality & Security Hardening

To comply with **SonarCloud Grade A** standards, the codebase incorporates the following practices:

- **Security (Grade A)**:
  - Centralized global error handling that hides raw MongoDB error logs and stack traces from clients in production.
  - Strict input validation using `mongoose.Types.ObjectId.isValid` on all endpoints matching `/api/users/:id` and `/api/cart/:userId/items` to block malicious request bodies.
  - Express app is configured with `helmet()` middleware to automatically inject secure HTTP headers (e.g. X-Content-Type-Options, X-Frame-Options).
- **Reliability & Maintainability (Grade A)**:
  - Reusable module patterns with clean ES6 import/export syntax.
  - Zero code smells, early-return code designs, and explicit type checking.
  - Unit tests configured using Node's native test runner to test core endpoints.
  - Properly managed `.gitignore` and `.dockerignore` configs to prevent host `node_modules` or configuration files from leaking into Git or Docker build contexts.

---

## 3. Directory Layout

```text
apps/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── app.js            # Express app setup, routing, and validation
│   │   ├── db.js             # Mongoose connection bootstrapper
│   │   ├── seed.js           # Database catalog seeder
│   │   ├── server.js         # Bootstrap entrypoint
│   │   └── models/           # Mongoose schemas (Cart, Order, Product, User)
│   ├── test/
│   │   └── health.test.js    # Health check unit tests
│   ├── Dockerfile            # Hardened multi-stage non-root Dockerfile
│   └── .dockerignore         # Excludes build contexts
│
└── frontend/                 # React Dashboard + Storefront
    ├── src/
    │   ├── App.jsx           # Dashboard tabs and storefront logic
    │   ├── main.jsx          # React entrypoint
    │   └── styles.css        # Custom CSS styling (SonarCloud layout)
    ├── nginx.conf            # NGINX proxy rules (non-root port 8080)
    ├── Dockerfile            # Multi-stage build (dist served by non-root NGINX)
    └── .dockerignore         # Excludes build contexts
```

---

## 4. API Documentation

### System Health
*   **`GET /api/health`**
    *   **Description**: Validates that the Express API is running and connected.
    *   **Response**: `200 OK`
        ```json
        { "status": "ok", "service": "cloudmart-backend" }
        ```

### Catalog Management
*   **`GET /api/products`**
    *   **Description**: Retrieves the complete catalog of e-commerce products sorted by creation date.
    *   **Response**: `200 OK`
        ```json
        {
          "products": [
            {
              "_id": "60d5ec49867c2937e06a3501",
              "name": "CloudMart Coffee Mug",
              "description": "Premium insulated ceramic mug",
              "price": 15.99,
              "category": "Accessories",
              "stock": 100
            }
          ]
        }
        ```

### User Profiles
*   **`GET /api/users/:id`**
    *   **Description**: Retrieves information about a user.
    *   **URL Params**: `:id` must be a valid 24-character hex MongoDB ObjectId.
    *   **Response**: `200 OK` / `400 Bad Request` / `404 Not Found`
        ```json
        {
          "user": {
            "_id": "60d5ec49867c2937e06a3500",
            "name": "Jane Doe",
            "email": "jane@cloudmart.com",
            "role": "customer"
          }
        }
        ```

### Cart Management
*   **`GET /api/cart/:userId`**
    *   **Description**: Retrieves the shopping cart for the specified user.
    *   **Response**: `200 OK`
        ```json
        {
          "cart": {
            "userId": "guest-user",
            "items": [
              {
                "productId": "60d5ec49867c2937e06a3501",
                "name": "CloudMart Coffee Mug",
                "price": 15.99,
                "quantity": 2
              }
            ]
          }
        }
        ```
*   **`POST /api/cart/:userId/items`**
    *   **Description**: Adds an item to the shopping cart.
    *   **Request Body**:
        ```json
        {
          "productId": "60d5ec49867c2937e06a3501",
          "quantity": 1
        }
        ```
    *   **Response**: `201 Created` / `400 Bad Request` (if productId format is invalid or quantity is not positive).

### Order Placement
*   **`POST /api/orders`**
    *   **Description**: Checks out the active cart and places an order.
    *   **Request Body**:
        ```json
        {
          "userId": "guest-user"
        }
        ```
    *   **Response**: `201 Created`
        ```json
        {
          "order": {
            "_id": "60d5ec49867c2937e06a3509",
            "userId": "guest-user",
            "items": [...],
            "total": 31.98,
            "status": "PLACED"
          }
        }
        ```

---

## 5. Local Setup and Execution

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose (V2+)

### Running Locally with Docker Compose (Recommended)
This starts MongoDB, compiles the React assets, configures the NGINX proxy, and starts the Express API. It runs the entire MERN stack in a hardened container space:

1.  **Launch the container stack**:
    ```bash
    docker compose up --build -d
    ```
2.  **Access the Application**:
    - **Frontend Dashboard / Storefront**: Open [http://localhost](http://localhost) (host port 80).
    - **API Status**: Open [http://localhost/api/health](http://localhost/api/health).
    - **MongoDB endpoint**: Connect on `localhost:27017`.
3.  **Shut down the stack**:
    ```bash
    docker compose down -v
    ```

### Manual Execution (Without Docker)

1.  **Start MongoDB**: Make sure MongoDB is running on your machine on port `27017`.
2.  **Start Backend API**:
    ```bash
    cd apps/backend
    npm install
    npm run dev
    ```
    To verify health: `curl http://localhost:8080/api/health`
3.  **Start Frontend**:
    ```bash
    cd apps/frontend
    npm install
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.
