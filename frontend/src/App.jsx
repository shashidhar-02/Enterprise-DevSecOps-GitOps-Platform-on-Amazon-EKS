import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuFeed from './pages/MenuFeed';
import DishDetails from './pages/DishDetails';
import AddDish from './pages/AddDish';
import AuthPage from './pages/AuthPage';
import api from './api';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      {user ? <Navbar user={user} onLogout={() => setUser(null)} /> : null}
      <main className="content-area">
        <Routes>
          <Route path="/" element={user ? <MenuFeed user={user} /> : <AuthPage onAuth={(u) => setUser(u)} />} />
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage onAuth={(u) => setUser(u)} />} />
          <Route path="/dish/:id" element={user ? <DishDetails /> : <Navigate to="/auth" replace />} />
          <Route path="/add" element={user ? <AddDish /> : <Navigate to="/auth" replace />} />
          <Route path="*" element={<div className="error">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;