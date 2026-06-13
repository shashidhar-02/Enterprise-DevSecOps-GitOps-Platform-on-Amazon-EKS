import { Product } from './models/Product.js';
import { User } from './models/User.js';

const products = [
  {
    name: 'Cloud Hoodie',
    description: 'Premium e-commerce hoodie for platform teams.',
    price: 59,
    category: 'Apparel',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
  },
  {
    name: 'Ops Laptop Stand',
    description: 'Ergonomic accessory for DevOps and SRE workstations.',
    price: 39,
    category: 'Accessories',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34',
  },
  {
    name: 'Observability Mug',
    description: 'Coffee mug for monitoring dashboards and incident reviews.',
    price: 19,
    category: 'Home Office',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
  },
];

export async function seedDatabase() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(products);
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.create({
      name: 'Guest User',
      email: 'guest@cloudmart.local',
      role: 'customer',
    });
  }
}
