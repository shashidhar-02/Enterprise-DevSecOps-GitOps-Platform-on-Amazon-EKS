
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import CraveDrop Routes
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Hide Express fingerprint
app.disable('x-powered-by');

// Allowed CORS origins from environment
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
).split(',');

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and approved origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check endpoint (Used by CI/CD and deployment checks)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CraveDrop API is serving hot and ready'
  });
});

// Mount Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    error: 'Internal Server Error'
  });
});

// Initialize database and start server
async function start() {
  try {
    await db.initDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CraveDrop backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();