const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cravedrop-dev-secret';
const COOKIE_NAME = 'cravedrop_session';

const users = [
  { id: 1, name: 'Demo User', email: 'demo@cravedrop.com', password: 'demo1234' }
];

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', (req, res) => {
  const { name, email, password, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const user = { id: Date.now(), name, email, password, address: address || '' };
  users.push(user);

  const token = signUser(user);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, address: user.address }, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signUser(user);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ user: { id: user.id, name: user.name, email: user.email, address: user.address || '' }, token });
});

router.get('/me', (req, res) => {
  const token = req.cookies[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: payload });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid session.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true });
});

module.exports = router;
