const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { pool } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'cravedrop-dev-secret';
const COOKIE_NAME = 'cravedrop_session';

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  const { name, email, password, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password]
    );
    const user = result.rows[0];

    let userAddress = address || '';
    if (userAddress) {
      await pool.query(
        'INSERT INTO addresses (user_id, street, city, type) VALUES ($1, $2, $3, $4)',
        [user.id, userAddress, 'Bangalore', 'Home']
      );
    }

    const token = signUser(user);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, address: userAddress }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database signup error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0 || userCheck.rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const user = userCheck.rows[0];

    const addressCheck = await pool.query('SELECT * FROM addresses WHERE user_id = $1 LIMIT 1', [user.id]);
    const userAddress = addressCheck.rows.length > 0 ? addressCheck.rows[0].street : '';

    const token = signUser(user);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, address: userAddress }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database login error' });
  }
});

router.get('/me', async (req, res) => {
  const token = req.cookies[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userCheck = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [payload.id]);
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }
    const user = userCheck.rows[0];

    const addressCheck = await pool.query('SELECT * FROM addresses WHERE user_id = $1 LIMIT 1', [user.id]);
    const userAddress = addressCheck.rows.length > 0 ? addressCheck.rows[0].street : '';

    return res.json({ user: { id: user.id, name: user.name, email: user.email, address: userAddress } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid session.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true });
});

module.exports = router;
