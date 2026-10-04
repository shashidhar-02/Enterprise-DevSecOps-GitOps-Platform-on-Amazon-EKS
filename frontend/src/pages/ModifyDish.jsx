import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

    useEffect(() => {
      api.get(`/restaurants/${id}`).then(({ data }) => setFormData(data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
      await api.put(`/restaurants/${id}`, formData);
    navigate('/');
  };

  return (
    <form onSubmit={handleUpdate} className="form-container">
      <h2>Edit Dish Details</h2>
      <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
      <button type="submit">Update Dish</button>
    </form>
  );
};

export default EditPost;