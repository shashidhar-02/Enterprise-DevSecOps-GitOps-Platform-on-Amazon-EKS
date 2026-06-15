require('dotenv').config();
const { pool, initDB } = require('./src/db');

async function seed() {
  console.log('Initializing tables...');
  await initDB();
  console.log('Seeding enterprise data...');
  try {
    // Clear old data to prevent constraint issues on existing data
    await pool.query('TRUNCATE TABLE dishes CASCADE');
    await pool.query('TRUNCATE TABLE restaurants CASCADE');

    const result = await pool.query(`
      INSERT INTO restaurants (name, description, category, emoji, image_url, rating, delivery_time, cuisine_type)
      VALUES 
        ('Truffles', 'Legendary burgers and steaks', 'Burger', '🍔', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 4.5, '35-40 mins', 'American, Fast Food'),
        ('Meghana Foods', 'Spicy Andhra style Biryani', 'Biryani', '🍗', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', 4.8, '25-30 mins', 'Andhra, Biryani, South Indian'),
        ('Leon Grill', 'Crispy fried chicken and wraps', 'Fast Food', '🍟', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop', 4.2, '20-25 mins', 'Fast Food, American'),
        ('A2B - Adyar Ananda Bhavan', 'Authentic South Indian meals', 'South Indian', '🥞', 'https://images.unsplash.com/photo-1610192202685-6126dc616782?w=400&h=300&fit=crop', 4.3, '15-20 mins', 'South Indian, Sweets')
      RETURNING id, name;
    `);

    const restMap = {};
    result.rows.forEach(r => restMap[r.name] = r.id);

    // Insert dishes for Truffles
    await pool.query(`
      INSERT INTO dishes (restaurant_id, name, description, price, is_veg, image_url)
      VALUES 
        ($1, 'All American Cheese Burger', 'Classic beef patty with double cheese and secret sauce.', 320, false, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'),
        ($1, 'Peri Peri Fries', 'Crispy fries tossed in spicy peri peri seasoning.', 150, true, 'https://images.unsplash.com/photo-1576107222564-9cb67770335e?w=200'),
        ($1, 'Ferrero Rocher Shake', 'Thick milkshake blended with premium chocolates.', 220, true, 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=200')
    `, [restMap['Truffles']]);

    // Insert dishes for Meghana
    await pool.query(`
      INSERT INTO dishes (restaurant_id, name, description, price, is_veg, image_url)
      VALUES 
        ($1, 'Meghana Special Chicken Biryani', 'Boneless chicken chunks in signature green spice mix.', 420, false, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200'),
        ($1, 'Paneer 65', 'Spicy deep-fried cottage cheese cubes.', 280, true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc3?w=200')
    `, [restMap['Meghana Foods']]);

    console.log('✅ Enterprise Seed complete!');
  } catch(e) {
    console.error('Seed failed:', e);
  }
  process.exit(0);
}

seed();
