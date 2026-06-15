import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  // Handle missing or differently structured data from the old backend gracefully
  const name = restaurant.name || 'Unknown Restaurant';
  const imageUrl = restaurant.image_url || `https://source.unsplash.com/400x300/?restaurant,food&sig=${restaurant.id || Math.random()}`;
  const rating = restaurant.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1); // Fake rating if missing
  const cuisines = restaurant.cuisine_type || 'Various Cuisines';
  const deliveryTime = restaurant.delivery_time || `${Math.floor(Math.random() * 30 + 15)} mins`;

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
      <div style={{ position: 'relative' }}>
        <img className="restaurant-card-img" src={imageUrl} alt={name} />
        {/* Fake offer for the UI */}
        <div className="restaurant-offer">
          50% OFF up to ₹100
        </div>
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
    </div>
  );
};

export default RestaurantCard;
