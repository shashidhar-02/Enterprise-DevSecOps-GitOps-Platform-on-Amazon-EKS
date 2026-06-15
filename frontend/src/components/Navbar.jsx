import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api';

const Navbar = ({ user, onLogout, toggleCart }) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      onLogout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="logo-section">
        <NavLink to="/" className="logo">
          🍔 CraveDrop
        </NavLink>
        <div className="location-picker">
          <strong>Home</strong>
          <span>Indiranagar, Bangalore</span>
          <span>▼</span>
        </div>
      </div>
      
      <div className="nav-actions">
        <NavLink to="/" className="nav-link">
          <span>🔍</span> Search
        </NavLink>
        <NavLink to="/add" className="nav-link">
          <span>➕</span> Add Dish
        </NavLink>
        <div className="nav-link" style={{ cursor: 'pointer' }}>
          <span>👤</span> {user?.name || 'Profile'}
        </div>
        <div className="nav-link" onClick={toggleCart} style={{ cursor: 'pointer' }}>
          <span>🛒</span> Cart 
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: 'none', color: 'var(--text-main)',
          fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;