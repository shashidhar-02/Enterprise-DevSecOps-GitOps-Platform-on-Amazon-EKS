const express = require('express');
const router = express.Router();
const { pool } = require('../db');

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
  const { user_id, restaurant_id, items, total_amount } = req.body;

  if (!user_id || !restaurant_id || !items) {
    return res.status(400).json({ error: 'User ID, Restaurant ID, and items are required' });
  }

  try {
    // Verify restaurant exists before placing the order
    const restaurantCheck = await pool.query('SELECT id FROM restaurants WHERE id = $1', [restaurant_id]);
    if (restaurantCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Insert order (storing items as a JSON string/object and defaulting status to 'Preparing')
    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, restaurant_id, JSON.stringify(items), total_amount || 0.00, 'Preparing']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// DELETE (Cancel) an order
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order cancelled 🗑️' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;