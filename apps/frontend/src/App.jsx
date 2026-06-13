import { useEffect, useMemo, useState } from 'react';

const userId = 'guest-user';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState('Loading CloudMart catalog...');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
        setStatus('Live catalog loaded from the backend API.');
      } catch (error) {
        setStatus('Backend unavailable. Verify the API service and NGINX proxy.');
      }
    };

    loadData();
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const addToCart = async (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product._id);
      if (existing) {
        return current.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });

    await fetch(`/api/cart/${userId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
      }),
    });
  };

  const placeOrder = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      setCart([]);
      setStatus('Order placed successfully. The backend created a new order in MongoDB.');
    }
  };

  return (
    <div className="shell">
      <header className="hero">
        <p className="eyebrow">CloudMart Enterprise Store</p>
        <h1>Three-tier MERN ecommerce platform on AWS EKS</h1>
        <p className="lead">
          React frontend served by NGINX, Node.js and Express API tier, and MongoDB data storage.
          Built to demonstrate production-style DevSecOps, GitOps, and platform engineering controls.
        </p>
        <div className="status">{status}</div>
      </header>

      <main className="grid">
        <section className="panel">
          <div className="section-header">
            <h2>Product Catalog</h2>
            <span>{products.length} items</span>
          </div>
          <div className="products">
            {products.map((product) => (
              <article key={product._id} className="card">
                <div className="card-image">{product.category}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="card-footer">
                  <strong>${product.price}</strong>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel cart-panel">
          <div className="section-header">
            <h2>Cart Summary</h2>
            <span>{cart.length} line items</span>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="muted">Cart is empty. Add a product to simulate checkout.</p>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))
            )}
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>${total}</strong>
          </div>
          <button type="button" className="checkout" onClick={placeOrder}>
            Place Order
          </button>
        </aside>
      </main>
    </div>
  );
}
