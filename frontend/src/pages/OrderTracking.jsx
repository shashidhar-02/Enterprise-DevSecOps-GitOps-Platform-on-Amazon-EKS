import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api';

const STAGES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial order data
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setCurrentStatus(response.data.status);
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // 2. Connect to WebSocket
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to tracker socket');
      socket.emit('join_order', id);
    });

    socket.on('order_status_updated', (data) => {
      console.log('Real-time update received:', data);
      setCurrentStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) return <div className="loading-shell">Loading Tracker...</div>;
  if (!order) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Order not found.</div>;

  const currentStageIndex = STAGES.indexOf(currentStatus) === -1 ? 0 : STAGES.indexOf(currentStatus);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
      <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-brand)', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem' }}>
        ← Back to Home
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Order #{order.id}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Total: ₹{parseFloat(order.total_amount) + parseFloat(order.delivery_fee) + parseFloat(order.taxes)}</p>
        </div>
        <div style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700 }}>
          {currentStatus}
        </div>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <h3 style={{ marginBottom: '2rem' }}>Live Tracking Progress</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {/* Progress Bar Background */}
          <div style={{ position: 'absolute', top: '15px', left: '0', width: '100%', height: '4px', background: '#e2e8f0', zIndex: 1 }}></div>
          {/* Active Progress Bar */}
          <div style={{ position: 'absolute', top: '15px', left: '0', width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`, height: '4px', background: 'var(--primary-brand)', zIndex: 2, transition: 'width 0.5s ease-in-out' }}></div>

          {STAGES.map((stage, index) => {
            const isActive = index <= currentStageIndex;
            return (
              <div key={stage} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
                <div style={{ 
                  width: '34px', height: '34px', borderRadius: '50%', 
                  background: isActive ? 'var(--primary-brand)' : '#fff', 
                  border: isActive ? 'none' : '4px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 'bold', transition: 'all 0.3s ease'
                }}>
                  {isActive ? '✓' : ''}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--secondary-dark)' : 'var(--text-muted)', textAlign: 'center' }}>
                  {stage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '3rem', background: 'var(--soft-bg)', padding: '1.5rem', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Order Details</h4>
        {order.items && JSON.parse(order.items).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{item.quantity}x {item.name}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
