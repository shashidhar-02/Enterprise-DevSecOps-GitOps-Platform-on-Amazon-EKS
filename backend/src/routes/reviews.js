const express = require('express');
const { wrap, positiveId, text, HttpError } = require('../security');

module.exports = (pool, security) => {
  const router = express.Router();
  router.get('/restaurant/:restaurantId', wrap(async (req, res) => {
    const result = await pool.query('SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT 100', [positiveId(req.params.restaurantId)]);
    res.json(result.rows);
  }));
  router.post('/', security.authenticate, wrap(async (req, res) => {
    if (!Number.isInteger(req.body.rating) || req.body.rating < 1 || req.body.rating > 5) throw new HttpError(400, 'Rating must be 1 to 5');
    const result = await pool.query('INSERT INTO reviews (restaurant_id, author, user_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [positiveId(req.body.restaurant_id), req.user.name, req.user.id, req.body.rating, text(req.body.comment, 2000)]);
    res.status(201).json(result.rows[0]);
  }));
  router.delete('/:id', security.authenticate, wrap(async (req, res) => {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 AND (user_id = $2 OR $3) RETURNING id',
      [positiveId(req.params.id), req.user.id, req.user.role === 'admin']);
    if (!result.rows[0]) throw new HttpError(404, 'Owned review not found');
    res.json({ message: 'Review deleted' });
  }));
  return router;
};
