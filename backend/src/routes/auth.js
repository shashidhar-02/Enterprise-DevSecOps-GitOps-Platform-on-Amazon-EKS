const express = require('express');
const { wrap, text, passwordInput, HttpError, hashPassword, verifyPassword } = require('../security');

module.exports = (pool, security) => {
  const router = express.Router();
  router.post('/signup', wrap(async (req, res) => {
    const name = text(req.body.name, 100);
    const email = text(req.body.email, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Invalid email');
    const password = passwordInput(req.body.password, 12);
    const address = text(req.body.address, 500, false);
    const passwordHash = await hashPassword(password);
    const client = await pool.connect();
    let user;
    try {
      await client.query('BEGIN');
      const result = await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, passwordHash]);
      user = result.rows[0];
      if (address) await client.query(
        'INSERT INTO addresses (user_id, street, city, type) VALUES ($1, $2, $3, $4)',
        [user.id, address, 'Bangalore', 'Home']);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
    security.issue(res, user);
    res.status(201).json({ user: { ...user, address } });
  }));
  router.post('/login', wrap(async (req, res) => {
    const email = text(req.body.email, 254).toLowerCase();
    const password = passwordInput(req.body.password);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      await hashPassword(password);
      throw new HttpError(401, 'Invalid email or password');
    }
    if (!await verifyPassword(password, user.password)) throw new HttpError(401, 'Invalid email or password');
    const addresses = await pool.query('SELECT street FROM addresses WHERE user_id = $1 ORDER BY id LIMIT 1', [user.id]);
    security.issue(res, user);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role,
      address: addresses.rows[0]?.street || '' } });
  }));
  router.get('/me', security.authenticate, wrap(async (req, res) => {
    const address = await pool.query('SELECT street FROM addresses WHERE user_id = $1 ORDER BY id LIMIT 1', [req.user.id]);
    res.json({ user: { ...req.user, address: address.rows[0]?.street || '' } });
  }));
  router.post('/logout', (_req, res) => {
    security.logout(res);
    res.json({ ok: true });
  });
  return router;
};
