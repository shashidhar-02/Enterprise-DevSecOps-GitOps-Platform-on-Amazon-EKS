import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import MenuFeed from './pages/MenuFeed';
import DishDetails from './pages/DishDetails';
import OrderTracking from './pages/OrderTracking';
import AddDish from './pages/AddDish';
import AuthPage from './pages/AuthPage';
import api from './api';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-shell">Loading CraveDrop…</div>;
  }

  return (
    <div className="app-wrapper">
      {user ? (
        <>
          <Navbar user={user} onLogout={() => setUser(null)} toggleCart={() => setIsCartOpen(!isCartOpen)} />
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} user={user} />
        </>
      ) : null}
      <main className="content-area" style={{ padding: user ? '2rem 1rem 4rem' : '0' }}>
        <Routes>
          <Route path="/" element={user ? <MenuFeed user={user} /> : <AuthPage onAuth={(u) => setUser(u)} />} />
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage onAuth={(u) => setUser(u)} />} />
          <Route path="/restaurant/:id" element={user ? <DishDetails /> : <Navigate to="/auth" replace />} />
          <Route path="/tracking/:id" element={user ? <OrderTracking /> : <Navigate to="/auth" replace />} />
          <Route path="/add" element={user ? <AddDish /> : <Navigate to="/auth" replace />} />
          <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '2rem' }}>404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;