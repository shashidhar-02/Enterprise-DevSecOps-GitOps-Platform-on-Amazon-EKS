import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(() => navigate('/')).catch(() => {});
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/${mode}`, form);
      setMessage(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <section className="auth-shell">
      <article className="auth-card">
        <p className="eyebrow">CraveDrop 2026</p>
        <h1>{mode === 'login' ? 'Sign in to your food journey' : 'Create your modern food account'}</h1>
        <p className="muted">Fast login, cookie-based sessions and personalized delivery suggestions.</p>
        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
          {mode === 'signup' && <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Delivery address" />}
          <button type="submit" className="primary-btn">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="ghost-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button>
        {message && <p className="status-pill">{message}</p>}
      </article>
      <aside className="promo-card">
        <p className="eyebrow">Why it feels premium</p>
        <h2>Swiggy-inspired food discovery</h2>
        <ul>
          <li>Polished cards, premium gradients, and quick delivery vibe.</li>
          <li>Cookie-based auth with JWT session storage for secure sign-ins.</li>
          <li>Personalized home feed with address-aware ordering.</li>
        </ul>
      </aside>
    </section>
  );
}
