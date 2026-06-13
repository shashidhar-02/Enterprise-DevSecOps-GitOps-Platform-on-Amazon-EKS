# CloudMart API Documentation

## Health
- `GET /api/health`
- Returns service health and status.

## Products
- `GET /api/products`
- Returns the product catalog.

## Cart
- `GET /api/cart/:userId`
- `POST /api/cart/:userId/items`
- Manages cart items for a user.

## Orders
- `POST /api/orders`
- Creates an order from the current cart.

## Users
- `GET /api/users/:id`
- Returns a user profile by id.
