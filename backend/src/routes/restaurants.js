const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all restaurants (newest first, with review count)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM reviews rev WHERE rev.restaurant_id = r.id) as review_count
       FROM restaurants r 
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET single restaurant with its reviews
router.get('/:id', async (req, res) => {
  try {
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [req.params.id]);
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const reviewsResult = await pool.query(
      'SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({
      ...restaurantResult.rows[0],
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

// CREATE restaurant
router.post('/', async (req, res) => {
  const { name, description, category, emoji } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Restaurant name and category are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (name, description, category, emoji) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, description || 'A delicious new spot', category, emoji || '🍔']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// UPDATE restaurant
router.put('/:id', async (req, res) => {
  const { name, description, category, emoji } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Restaurant name and category are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE restaurants 
       SET name = $1, description = $2, category = $3, emoji = $4, updated_at = NOW() 
       WHERE id = $5 
       RETURNING *`,
      [name, description || 'A delicious new spot', category, emoji || '🍔', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update restaurant details' });
  }
});

// DELETE restaurant
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant removed from platform successfully 🗑️' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

module.exports = router;