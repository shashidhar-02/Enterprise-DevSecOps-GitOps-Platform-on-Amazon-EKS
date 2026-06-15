import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api';

const CartSidebar = ({ isOpen, onClose, user }) => {
  const { cart: items, clearCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    
    // Check if items are from the same restaurant (simplified logic)
    const restaurantId = items.length > 0 ? items[0].restaurant_id : null;

    try {
      setLoading(true);
      const orderData = {
        user_id: user.id || user.email,
        restaurant_id: restaurantId || 1, // fallback to 1 if no restaurant_id attached
        items: items,
        total_amount: getTotalPrice(),
        delivery_fee: 45,
        taxes: 20
      };

      const response = await api.post('/orders', orderData);
      
      clearCart();
      onClose();
      // Redirect to Order Tracking page
      navigate(`/tracking/${response.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Cart</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
              <h3>Your cart is empty</h3>
              <p>You can go to home page to view more restaurants</p>
            </div>
          ) : (
            <div>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`dish-type ${item.is_veg ? 'veg' : 'non-veg'}`} style={{ width: '12px', height: '12px', marginBottom: 0 }}></div>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>x{item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #d3d3d3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Item Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
                  <span>₹45</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Taxes</span>
                  <span>₹20</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 800, fontSize: '1.2rem' }}>
              <span>To Pay</span>
              <span>₹{getTotalPrice() + 45 + 20}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
