const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 5432), database: process.env.DB_NAME,
  max: 10, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000,
  statement_timeout: 5000, query_timeout: 5000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true,
    ...(process.env.DB_CA_FILE ? { ca: fs.readFileSync(process.env.DB_CA_FILE, 'utf8') } : {}) } : undefined,
});
pool.on('error', () => console.error('Unexpected database pool error'));

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(71500)');
    await client.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

module.exports = { pool, initDB };
