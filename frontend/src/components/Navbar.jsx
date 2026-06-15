import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api';

const Navbar = ({ user, onLogout }) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    onLogout();
    navigate('/auth');
  };

  return (
    <nav className="navbar-container">
      <div>
        <div className="logo">CraveDrop 🍔</div>
        <p className="mini-copy">Fresh food, fast delivery, premium feel</p>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? 'active' : '')}>Add Dish</NavLink>
      </div>
      <div className="nav-actions">
        <div className="profile-pill">Hi, {user?.name || 'Foodie'}</div>
        <button className="cart-btn">🛒 <span className="badge">{totalItems}</span></button>
        <button className="ghost-btn small" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;