import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    emoji: '🍔',
    imageUrl: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/restaurants', formData);
      alert('Dish added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to add dish');
    }
  };

  return (
    <div className="form-container">
      <section className="form-card">
        <h2>Add a fresh dish</h2>
        <p>Fill in the details below to add a new restaurant dish to the menu.</p>
        <form onSubmit={handleSubmit}>
          <input placeholder="Dish name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input placeholder="Category" onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <input placeholder="Emoji (optional)" onChange={(e) => setFormData({ ...formData, emoji: e.target.value || '🍔' })} />
          <input placeholder="Image URL (optional)" onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
          <button type="submit">Add dish</button>
        </form>
      </section>

      <aside className="info-card">
        <h2>Why this page matters</h2>
        <p>CraveDrop uses this form to create new restaurant entries that appear on the home feed.</p>
        <ul>
          <li>Choose a category to organize the dish.</li>
          <li>Add a friendly emoji for quick visual recognition.</li>
          <li>Use the image URL to make the card more inviting.</li>
        </ul>
      </aside>
    </div>
  );
};

export default CreatePost;