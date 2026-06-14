-- Create roles for each microservice
CREATE ROLE user_service WITH LOGIN PASSWORD 'user_pass';
CREATE ROLE restaurant_service WITH LOGIN PASSWORD 'restaurant_pass';
CREATE ROLE order_service WITH LOGIN PASSWORD 'order_pass';
CREATE ROLE payment_service WITH LOGIN PASSWORD 'payment_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE user_db TO user_service;
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_service;
GRANT ALL PRIVILEGES ON DATABASE order_db TO order_service;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_service;
