import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';

/**
 * Creates and configures the Express application.
 * Enforces security headers, handles routing, and processes errors.
 */
export function createApp() {
  const app = express();

  // Enforce security headers
  app.use(helmet());
  app.use(express.json());
  app.use(morgan('combined'));

  /**
   * @route GET /api/health
   * @desc Health check endpoint for container and EKS lifecycle validation
   */
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'cloudmart-backend' });
  });

  /**
   * @route GET /api/products
   * @desc Retrieve all products, sorted by newest first
   */
  app.get('/api/products', async (_req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json({ products });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route GET /api/users/:id
   * @desc Retrieve user information by MongoDB ObjectId
   */
  app.get('/api/users/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ObjectId format to prevent database query errors
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route GET /api/cart/:userId
   * @desc Retrieve the active cart for a user (or return an empty cart)
   */
  app.get('/api/cart/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ userId });
      res.json({ cart: cart || { userId, items: [] } });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route POST /api/cart/:userId/items
   * @desc Add an item to the user's cart
   */
  app.post('/api/cart/:userId/items', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { productId, quantity = 1 } = req.body;

      // Validate inputs
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Valid productId is required' });
      }

      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive integer' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $setOnInsert: { userId, items: [] },
          $push: {
            items: {
              productId: String(product._id),
              name: product.name,
              price: product.price,
              quantity: parsedQuantity,
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

  /**
   * @route POST /api/orders
   * @desc Place a new order using the user's cart items
   */
  app.post('/api/orders', async (req, res, next) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

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

      // Clear the cart after successfully placing the order
      cart.items = [];
      await cart.save();

      res.status(201).json({ order });
    } catch (error) {
      next(error);
    }
  });

  // Global centralized error handling middleware
  app.use((error, _req, res, _next) => {
    console.error('Unhandled server error:', error);
    
    // Do not leak stack traces or raw database error details to clients in production
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({ 
      message: 'Internal server error', 
      detail: isProduction ? 'An unexpected error occurred on the server.' : error.message 
    });
  });

  return app;
}

