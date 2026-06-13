import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Product', productSchema);
