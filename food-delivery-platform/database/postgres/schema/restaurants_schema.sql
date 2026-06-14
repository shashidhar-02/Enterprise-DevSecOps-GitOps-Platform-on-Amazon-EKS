\c restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL, -- references users(id) conceptually
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
