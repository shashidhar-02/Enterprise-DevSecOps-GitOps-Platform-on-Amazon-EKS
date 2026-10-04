const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const { createSecurity, HttpError, wrap } = require('./security');

function createApp({ pool, jwtSecret, production = false, emit = () => {} }) {
  const app = express();
  const security = createSecurity(pool, jwtSecret, production);
  const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8080').split(',').map((origin) => origin.trim());
  app.disable('x-powered-by');
  const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(proxyHops) || proxyHops < 0 || proxyHops > 3) throw new Error('Invalid TRUST_PROXY_HOPS');
  app.set('trust proxy', proxyHops);
  app.use(helmet());
  app.use(cors({ credentials: true, origin: (origin, callback) => {
    callback(origin && !origins.includes(origin) ? new HttpError(403, 'Origin not allowed') : null, true);
  } }));
  app.use(cookieParser());
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/api/ready', wrap(async (_req, res) => {
    try { await pool.query('SELECT 1'); } catch { throw new HttpError(503, 'Database unavailable'); }
    res.json({ status: 'ready' });
  }));
  app.use('/api', rateLimit({ windowMs: 60000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/api/auth', rateLimit({ windowMs: 60000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }), require('./routes/auth')(pool, security));
  app.use('/api/restaurants', require('./routes/restaurants')(pool, security));
  app.use('/api/orders', require('./routes/orders')(pool, security, emit));
  app.use('/api/reviews', require('./routes/reviews')(pool, security));
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((error, _req, res, _next) => {
    const status = error.code === '23505' || error.code === '23503' ? 409 : error.status || 500;
    if (status >= 500) console.error('Request failed:', error.code || 'internal');
    res.status(status).json({ error: error.type === 'entity.parse.failed' ? 'Invalid JSON' : status >= 500 ? 'Service unavailable' :
      error.code ? 'Conflicting record' : error.message });
  });
  return { app, security };
}

module.exports = { createApp };
