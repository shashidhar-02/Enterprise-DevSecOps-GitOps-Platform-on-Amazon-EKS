require('dotenv').config();
const { pool, initDB } = require('./src/db');

async function seed() {
  if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DEMO_SEED !== 'true') {
    throw new Error('Demo seed requires ALLOW_DEMO_SEED=true and a non-production database');
  }
  await initDB();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(71500)');
    const existing = await client.query('SELECT id FROM restaurants LIMIT 1');
    if (existing.rows.length) throw new Error('Demo seed only runs on an empty catalogue');
    const result = await client.query(`INSERT INTO restaurants (name, description, category, emoji, cuisine_type)
      VALUES ('Demo Kitchen', 'Local development sample menu', 'Burger', '🍔', 'Fast Food') RETURNING id`);
    await client.query(`INSERT INTO dishes (restaurant_id, name, description, price, is_veg)
      VALUES ($1, 'Veggie Burger', 'Demo catalogue item', 150.00, true),
      ($1, 'Fries', 'Demo catalogue item', 80.00, true)`, [result.rows[0].id]);
    await client.query('COMMIT');
    console.log('Demo catalogue created');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
seed().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
