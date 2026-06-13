import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(morgan('combined'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'cloudmart-backend' });
  });

  app.get('/api/products', async (_req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json({ products });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/users/:id', async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/cart/:userId', async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.json({ cart: cart || { userId: req.params.userId, items: [] } });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/cart/:userId/items', async (req, res, next) => {
    try {
      const { productId, quantity = 1 } = req.body;
      if (typeof productId !== 'string' || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const cart = await Cart.findOneAndUpdate(
        { userId: req.params.userId },
        {
          $setOnInsert: { userId: req.params.userId, items: [] },
          $push: {
            items: {
              productId: String(product._id),
              name: product.name,
              price: product.price,
              quantity,
            },
          },
        },
        { upsert: true, new: true },
      );

      res.status(201).json({ cart });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/orders', async (req, res, next) => {
    try {
      const { userId } = req.body;
      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = await Order.create({
        userId,
        items: cart.items,
        total,
        status: 'PLACED',
      });

      cart.items = [];
      await cart.save();

      res.status(201).json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  });

  return app;
}
