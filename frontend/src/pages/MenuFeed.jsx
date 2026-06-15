import React, { useEffect, useState } from 'react';
import api from '../api';
import Carousel from '../components/Carousel';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = [
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  { name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop' },
  { name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { name: 'South Indian', image: 'https://images.unsplash.com/photo-1610192202685-6126dc616782?w=200&h=200&fit=crop' }
];

const MenuFeed = ({ user }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/restaurants');
        if (Array.isArray(response.data)) {
          setRestaurants(response.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="skeleton" style={{ height: '300px', width: '100%', marginBottom: '2rem' }}></div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'hidden' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ width: '140px', height: '140px', borderRadius: '50%' }}></div>)}
        </div>
      </div>
    );
  }

  const filteredRestaurants = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Carousel title="What's on your mind?" items={CATEGORIES} />

      <div className="search-bar" style={{ margin: '2rem auto' }}>
        <input 
          type="text" 
          placeholder="Search for restaurants and food..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary-dark)', marginBottom: '1.5rem' }}>
          Top restaurant chains in Bangalore
        </h2>
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant, index) => (
             <RestaurantCard key={restaurant.id || restaurant._id || index} restaurant={restaurant} />
          ))}
          {filteredRestaurants.length === 0 && (
            <p>No restaurants found. Please add some via the backend.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuFeed;