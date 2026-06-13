# CloudMart Database Schema

CloudMart uses MongoDB for the student portfolio implementation.

## Collections
- `users`: customer profile data
- `products`: catalog items
- `carts`: current shopping cart contents
- `orders`: placed orders and checkout history

## Notes
- Keep schema simple and aligned to the API models.
- Seed data is inserted by the backend on startup for demo purposes.
