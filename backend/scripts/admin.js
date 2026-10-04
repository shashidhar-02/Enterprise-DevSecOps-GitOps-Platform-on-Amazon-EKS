require('dotenv').config();
const { pool } = require('../src/db');

async function promote() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error('Set ADMIN_EMAIL to an existing registered account');
  const result = await pool.query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id", [email]);
  if (result.rowCount !== 1) throw new Error('Account not found');
  console.log('Administrator role assigned');
}
promote().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
