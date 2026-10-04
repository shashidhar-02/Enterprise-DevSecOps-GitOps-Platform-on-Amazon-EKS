const express = require('express');
const { wrap, positiveId, HttpError } = require('../security');
const { priceOrder } = require('../pricing');

module.exports = (pool, security, emit) => {
  const router = express.Router();
  router.use(security.authenticate);
  router.get('/user/:userId', wrap(async (req, res) => {
    if (positiveId(req.params.userId) !== req.user.id) throw new HttpError(403, 'Not your order history');
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100', [String(req.user.id)]);
    res.json(result.rows);
  }));
  router.post('/', wrap(async (req, res) => {
    if (req.body.user_id !== undefined && positiveId(req.body.user_id) !== req.user.id) throw new HttpError(403, 'Not your account');
    const restaurantId = positiveId(req.body.restaurant_id);
    const items = req.body.items;
    if (!Array.isArray(items) || !items.length || items.length > 50) throw new HttpError(400, 'Provide 1 to 50 items');
    const ids = items.map((item) => positiveId(item?.id));
    const dishes = await pool.query('SELECT id, name, price FROM dishes WHERE restaurant_id = $1 AND id = ANY($2::int[])', [restaurantId, ids]);
    const priced = priceOrder(items, dishes.rows);
    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, delivery_fee, taxes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [String(req.user.id), restaurantId, JSON.stringify(priced.items), priced.total, 45, 20, 'Order Received']);
    emit(result.rows[0]);
    res.status(201).json(result.rows[0]);
  }));
  router.get('/:id', wrap(async (req, res) => {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [positiveId(req.params.id), String(req.user.id)]);
    if (!result.rows[0]) throw new HttpError(404, 'Order not found');
    res.json(result.rows[0]);
  }));
  router.put('/:id/status', wrap(async (req, res) => {
    if (req.user.role !== 'admin') throw new HttpError(403, 'Administrator required');
    const states = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!states.includes(req.body.status)) throw new HttpError(400, 'Invalid order status');
    const result = await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [req.body.status, positiveId(req.params.id)]);
    if (!result.rows[0]) throw new HttpError(404, 'Order not found');
    emit(result.rows[0]);
    res.json(result.rows[0]);
  }));
  router.delete('/:id', wrap(async (req, res) => {
    const result = await pool.query("UPDATE orders SET status = 'Cancelled', updated_at = NOW() WHERE id = $1 AND user_id = $2 AND status IN ('Order Received', 'Preparing') RETURNING *", [positiveId(req.params.id), String(req.user.id)]);
    if (!result.rows[0]) throw new HttpError(409, 'Order cannot be cancelled');
    emit(result.rows[0]);
    res.json(result.rows[0]);
  }));
  return router;
};
