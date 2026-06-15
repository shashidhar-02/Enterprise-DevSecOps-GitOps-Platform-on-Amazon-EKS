import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const DEMO_CREDENTIALS = {
  email: 'test@gmail.com',
  password: 'pass@123',
};

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    address: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        if (onAuth) onAuth(data.user);
        navigate('/');
      })
      .catch(() => {});
  }, [navigate, onAuth]);

  useEffect(() => {
    if (mode === 'login') {
      setForm((prev) => ({
        ...prev,
        name: '',
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
        address: '',
      }));
      return;
    }

    setForm({ name: '', email: '', password: '', address: '' });
  }, [mode]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      if (data.token) {
        localStorage.setItem('cravedrop_token', data.token);
      }
      if (onAuth) {
        onAuth(data.user);
      }
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
        <p className="muted">Experience next-level dining and real-time order tracking.</p>
        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
          {mode === 'signup' && <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Delivery address" />}
          <button type="submit" className="primary-btn">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        {mode === 'login' && (
          <p className="auth-note">
            Demo sign-in: <strong>test@gmail.com</strong> / <strong>pass@123</strong>
          </p>
        )}
        <button className="ghost-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button>
        {message && <p className="status-pill">{message}</p>}
      </article>
    </section>
  );
}
