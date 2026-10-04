import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {

  // Handle missing or differently structured data from the old backend gracefully
  const name = restaurant.name || 'Unknown Restaurant';
  const imageUrl = restaurant.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400';
  const rating = restaurant.rating || 'Not rated';
  const cuisines = restaurant.cuisine_type || 'Various Cuisines';
  const deliveryTime = restaurant.delivery_time || 'Estimate unavailable';

  return (
    <Link className="restaurant-card" to={`/restaurant/${restaurant.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
      <div style={{ position: 'relative' }}>
        <img className="restaurant-card-img" src={imageUrl} alt={name} />
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-title">{name}</h3>
        <div className="restaurant-meta">
          <span className="rating-badge">★ {rating}</span>
          <span className="delivery-time">• {deliveryTime}</span>
        </div>
        <div className="cuisines">{cuisines}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {restaurant.location || 'Bangalore'}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
