import React from 'react';

export default function DishCard({ item, onAddToCart }) {
  if (!item) return null;
  const price = Number(item.price);
  return <div className="food-card-shadow">
    <div className="card-image-wrapper"><img src={item.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'} alt={item.name} /></div>
    <div className="card-content"><h3>{item.name}</h3><p className="description">{item.description}</p>
      <div className="card-footer"><span className="price">₹{Number.isFinite(price) ? price.toFixed(2) : 'Unavailable'}</span>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(item)}>Add +</button>
      </div>
    </div>
  </div>;
}
