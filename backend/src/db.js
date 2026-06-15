const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
});

async function initDB() {
  const client = await pool.connect();
  try {
    // 0. Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 0.1 Create Addresses Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        street TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'Home'
      );
    `);

    // 1. Create/Alter Restaurants Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        emoji VARCHAR(10) DEFAULT '🍔',
        image_url TEXT,
        rating DECIMAL(3,1) DEFAULT 4.0,
        delivery_time VARCHAR(50) DEFAULT '30-40 mins',
        cuisine_type VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add missing columns if migrating from v1
    try {
      await client.query(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS image_url TEXT;`);
      await client.query(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 4.0;`);
      await client.query(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(50) DEFAULT '30-40 mins';`);
      await client.query(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cuisine_type VARCHAR(255);`);
    } catch (e) {
      console.log('Columns already exist or could not be altered.');
    }

    // 1.1 Create Dishes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        is_veg BOOLEAN DEFAULT true,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Create/Alter Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL, -- Keeping string for backward compat, ideally INTEGER REFERENCES users(id)
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        items JSONB NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        delivery_fee DECIMAL(10, 2) DEFAULT 45.00,
        taxes DECIMAL(10, 2) DEFAULT 20.00,
        status VARCHAR(50) DEFAULT 'Preparing',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    try {
      await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 45.00;`);
      await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 20.00;`);
    } catch (e) {}

    // 3. Create Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        author VARCHAR(100) NOT NULL DEFAULT 'Hungry Foodie',
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed Demo User if not exists
    const demoUserCheck = await client.query('SELECT * FROM users WHERE email = $1', ['demo@cravedrop.com']);
    if (demoUserCheck.rows.length === 0) {
      const demoUserInsert = await client.query(
        "INSERT INTO users (name, email, password) VALUES ('Demo User', 'demo@cravedrop.com', 'demo1234') RETURNING id"
      );
      const demoUserId = demoUserInsert.rows[0].id;
      await client.query(
        "INSERT INTO addresses (user_id, street, city, type) VALUES ($1, 'Indiranagar, Bangalore', 'Bangalore', 'Home')",
        [demoUserId]
      );
      console.log('✅ Demo user and address seeded into PostgreSQL database.');
    }

    console.log('✅ CraveDrop Phase 2 Enterprise Database tables initialized');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };