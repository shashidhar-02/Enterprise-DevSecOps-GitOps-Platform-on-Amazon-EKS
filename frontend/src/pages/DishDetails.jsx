import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import useCartStore from '../store/cartStore';

const DishDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const resResponse = await api.get(`/restaurants/${id}`);
        setRestaurant(resResponse.data);
        
        try {
          const dishResponse = await api.get(`/restaurants/${id}/dishes`);
          setDishes(dishResponse.data);
        } catch(e) {
          console.error("Dishes not found, using empty array");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="menu-page">
        <div className="skeleton" style={{ height: '80px', width: '50%', marginBottom: '2rem' }}></div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '150px', width: '100%', marginBottom: '1rem' }}></div>
        ))}
      </div>
    );
  }

  if (!restaurant) {
    return <div className="menu-page"><h2>Restaurant not found</h2></div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>{restaurant.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{restaurant.cuisine_type || 'Various Cuisines'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
          <span className="rating-badge" style={{ fontSize: '1rem', padding: '4px 8px' }}>★ {restaurant.rating || 4.2}</span>
          <span>• {restaurant.delivery_time || '30-40 mins'}</span>
          <span>• ₹400 for two</span>
        </div>
      </div>

      <div className="menu-category">
        <h2>Recommended</h2>
        {dishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No dishes available for this restaurant yet.
          </div>
        ) : (
          dishes.map((dish) => (
            <div key={dish.id} className="dish-item">
              <div className="dish-details">
                <div className={`dish-type ${dish.is_veg ? 'veg' : 'non-veg'}`}></div>
                <h3 className="dish-name">{dish.name}</h3>
                <div className="dish-price">₹{dish.price}</div>
                <p className="dish-description">{dish.description}</p>
              </div>
              <div className="dish-image-container">
                <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200'} alt={dish.name} className="dish-image" />
                <button className="add-btn" onClick={() => addToCart({ ...dish, restaurant_id: restaurant.id, quantity: 1 })}>
                  ADD
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DishDetails;