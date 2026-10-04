import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      onAuth(data.user);
      navigate('/');
    } catch (error) { setMessage(error.response?.data?.error || 'Authentication failed'); }
    finally { setBusy(false); }
  };
  return (
    <section className="auth-shell"><article className="auth-card">
      <p className="eyebrow">CraveDrop</p>
      <h1>{mode === 'login' ? 'Sign in to your food journey' : 'Create your food account'}</h1>
      <form onSubmit={submit} className="auth-form">
        {mode === 'signup' && <input value={form.name} maxLength={100} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />}
        <input type="email" value={form.email} maxLength={254} autoComplete="email" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
        <input type="password" value={form.password} maxLength={128} minLength={mode === 'signup' ? 12 : 1} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
        {mode === 'signup' && <input value={form.address} maxLength={500} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Delivery address" />}
        <button type="submit" className="primary-btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="ghost-btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setForm({ name: '', email: '', password: '', address: '' }); setMessage(''); }}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
      {message && <p className="status-pill" role="alert">{message}</p>}
    </article></section>
  );
}
