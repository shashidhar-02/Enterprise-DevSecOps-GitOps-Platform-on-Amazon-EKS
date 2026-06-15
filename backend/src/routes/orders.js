const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const socketModule = require('../socket');

// GET orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// CREATE a new food order
router.post('/', async (req, res) => {
  const { user_id, restaurant_id, items, total_amount, delivery_fee, taxes } = req.body;

  if (!user_id || !restaurant_id || !items) {
    return res.status(400).json({ error: 'User ID, Restaurant ID, and items are required' });
  }

  try {
    const restaurantCheck = await pool.query('SELECT id FROM restaurants WHERE id = $1', [restaurant_id]);
    if (restaurantCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, delivery_fee, taxes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, restaurant_id, JSON.stringify(items), total_amount || 0.00, delivery_fee || 45.0, taxes || 20.0, 'Order Received']
    );
    
    // Emit websocket event
    try {
      const io = socketModule.getIO();
      io.to(`order_${result.rows[0].id}`).emit('order_status_updated', {
        orderId: result.rows[0].id,
        status: 'Order Received'
      });
    } catch(e) { console.error('Socket error:', e.message); }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET single order for tracking
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// UPDATE order status (Admin/Driver)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    // Emit real-time update
    try {
      const io = socketModule.getIO();
      io.to(`order_${result.rows[0].id}`).emit('order_status_updated', {
        orderId: result.rows[0].id,
        status: status,
        updated_at: result.rows[0].updated_at
      });
    } catch(e) { console.error('Socket error:', e.message); }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;