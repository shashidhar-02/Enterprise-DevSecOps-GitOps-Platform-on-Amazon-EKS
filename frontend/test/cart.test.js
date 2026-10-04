import test from 'node:test';
import assert from 'node:assert/strict';
const storage = new Map();
globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) };
const { default: useCartStore } = await import('../src/store/cartStore.js');
const item = { id: 1, restaurant_id: 3, name: 'Meal', price: '10.10' };

test('cart combines items, computes totals and preserves its single-restaurant contract', () => {
  const cart = useCartStore.getState();
  cart.clearCart(); cart.addToCart(item); cart.addToCart(item);
  assert.equal(cart.getTotalItems(), 2);
  assert.equal(cart.getTotalPrice(), 20.2);
  assert.throws(() => cart.addToCart({ ...item, id: 2, restaurant_id: 4 }), /different restaurant/);
  assert.equal(cart.getTotalItems(), 2);
  cart.updateQuantity(1, -10);
  assert.equal(cart.getTotalItems(), 1);
  cart.updateQuantity(1, 200);
  assert.equal(cart.getTotalItems(), 99);
  cart.removeFromCart(1);
  assert.equal(cart.getTotalItems(), 0);
});

test('clearing the cart clears persisted items before the next account signs in', () => {
  const cart = useCartStore.getState();
  cart.addToCart(item); cart.clearCart();
  assert.deepEqual(JSON.parse(storage.get('cravedrop-cart-storage')).state.cart, []);
  cart.addToCart({ ...item, restaurant_id: 4 });
  assert.equal(cart.getTotalItems(), 1);
  cart.clearCart();
});
