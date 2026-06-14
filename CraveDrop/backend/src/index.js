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

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (Used by CI/CD and deployment checks)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CraveDrop API is serving hot and ready 🛵✨' });
});

// Mount Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Initialize database and start server
async function start() {
  try {
    await db.initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CraveDrop backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();