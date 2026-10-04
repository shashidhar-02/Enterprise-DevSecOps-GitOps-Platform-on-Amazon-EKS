const express = require('express');
const { wrap, positiveId, text, HttpError } = require('../security');

module.exports = (pool, security) => {
  const router = express.Router();
  router.get('/', wrap(async (req, res) => {
    const search = text(req.query.search, 100, false);
    const result = await pool.query(`SELECT r.*, (SELECT AVG(rating)::numeric(3,1) FROM reviews rev WHERE rev.restaurant_id = r.id) AS rating,
      (SELECT COUNT(*) FROM reviews rev WHERE rev.restaurant_id = r.id) AS review_count
      FROM restaurants r WHERE name ILIKE $1 OR category ILIKE $1 OR cuisine_type ILIKE $1 ORDER BY created_at DESC LIMIT 100`, [`%${search}%`]);
    res.json(result.rows);
  }));
  router.get('/:id', wrap(async (req, res) => {
    const id = positiveId(req.params.id);
    const result = await pool.query('SELECT r.*, (SELECT AVG(rating)::numeric(3,1) FROM reviews WHERE restaurant_id = r.id) AS rating FROM restaurants r WHERE id = $1', [id]);
    if (!result.rows[0]) throw new HttpError(404, 'Restaurant not found');
    const reviews = await pool.query('SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT 100', [id]);
    res.json({ ...result.rows[0], reviews: reviews.rows });
  }));
  router.get('/:id/dishes', wrap(async (req, res) => {
    const result = await pool.query('SELECT * FROM dishes WHERE restaurant_id = $1 ORDER BY id LIMIT 100', [positiveId(req.params.id)]);
    res.json(result.rows);
  }));
  router.post('/', security.authenticate, wrap(async (req, res) => {
    const result = await pool.query(`INSERT INTO restaurants (name, description, category, emoji, image_url, cuisine_type, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [text(req.body.name, 255), text(req.body.description, 2000, false),
      text(req.body.category, 100), text(req.body.emoji, 10, false) || '🍔', text(req.body.image_url, 2048, false),
      text(req.body.cuisine_type, 255, false), req.user.id]);
    res.status(201).json(result.rows[0]);
  }));
  router.post('/:id/dishes', security.authenticate, wrap(async (req, res) => {
    const restaurantId = positiveId(req.params.id);
    const owner = await pool.query('SELECT id FROM restaurants WHERE id = $1 AND (owner_id = $2 OR $3)',
      [restaurantId, req.user.id, req.user.role === 'admin']);
    if (!owner.rows.length) throw new HttpError(404, 'Owned restaurant not found');
    const price = String(req.body.price);
    if (!/^\d{1,7}(\.\d{1,2})?$/.test(price)) throw new HttpError(400, 'Price must be a non-negative amount with at most two decimal places');
    if (typeof req.body.is_veg !== 'boolean') throw new HttpError(400, 'is_veg must be a boolean');
    const result = await pool.query(`INSERT INTO dishes (restaurant_id, name, description, price, is_veg, image_url)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [restaurantId, text(req.body.name, 255),
      text(req.body.description, 2000, false), price, req.body.is_veg, text(req.body.image_url, 2048, false)]);
    res.status(201).json(result.rows[0]);
  }));
  router.put('/:id', security.authenticate, wrap(async (req, res) => {
    const result = await pool.query(`UPDATE restaurants SET name = $1, description = $2, category = $3,
      emoji = $4, image_url = $5, cuisine_type = $6, updated_at = NOW()
      WHERE id = $7 AND (owner_id = $8 OR $9) RETURNING *`, [text(req.body.name, 255), text(req.body.description, 2000, false),
      text(req.body.category, 100), text(req.body.emoji, 10, false) || '🍔', text(req.body.image_url, 2048, false),
      text(req.body.cuisine_type, 255, false), positiveId(req.params.id), req.user.id, req.user.role === 'admin']);
    if (!result.rows[0]) throw new HttpError(404, 'Owned restaurant not found');
    res.json(result.rows[0]);
  }));
  router.delete('/:id', security.authenticate, wrap(async (req, res) => {
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 AND (owner_id = $2 OR $3) RETURNING id',
      [positiveId(req.params.id), req.user.id, req.user.role === 'admin']);
    if (!result.rows[0]) throw new HttpError(404, 'Owned restaurant not found');
    res.json({ message: 'Restaurant deleted' });
  }));
  return router;
};
