// src/pages/MenuFeed.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import DishCard from '../components/DishCard';
import useCartStore from '../store/cartStore';

const MenuFeed = ({ user }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
          const response = await api.get('/restaurants');
        
        // --- CRITICAL DEBUGGING ---
        // Print the type and content to your F12 Console
        console.log("ACTUAL API DATA:", response.data);
        
        // If the data is NOT an array, this will show in the console
        if (!Array.isArray(response.data)) {
           console.error("API Error: Expected array, got:", typeof response.data);
           setMenu([]);
        } else {
           setMenu(response.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">CraveDrop • 2026</p>
          <h1>Good food, faster delivery, smarter choices.</h1>
          <p className="hero-copy">Enjoy a premium Swiggy-style home feed with your personalized delivery address and a clean modern cart experience.</p>
          <div className="chip-row">
            <span className="chip">Fast delivery</span>
            <span className="chip">Fresh picks</span>
            <span className="chip">Trusted reviews</span>
          </div>
        </div>
        <div className="hero-badge">
          <strong>Delivering to</strong>
          <span>{user?.address || 'Your saved address'}</span>
          <small>Signed in with secure cookie session</small>
        </div>
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Popular near you</p>
          <h2>Today’s specials</h2>
        </div>
        <input className="search-box" placeholder="Search restaurants or dishes" />
      </section>

      <div className="menu-grid">
        {menu.map((item, index) => {
          // Wrap in a simple check
          if (!item || typeof item !== 'object') return null;
          
          return (
            <DishCard 
              key={item._id || index} 
              item={item} 
              onAddToCart={addToCart} 
            />
          );
        })}
      </div>
    </div>
  );
};
export default MenuFeed;