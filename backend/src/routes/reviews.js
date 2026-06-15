const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET reviews for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [req.params.restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// CREATE review
router.post('/', async (req, res) => {
  const { restaurant_id, author, rating, comment } = req.body;

  if (!restaurant_id || !rating || !comment) {
    return res.status(400).json({ error: 'Restaurant ID, rating, and comment are required' });
  }

  try {
    // Verify restaurant exists
    const restaurantCheck = await pool.query('SELECT id FROM restaurants WHERE id = $1', [restaurant_id]);
    if (restaurantCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (restaurant_id, author, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant_id, author || 'Hungry Foodie', rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post review' });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted 🗑️' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;