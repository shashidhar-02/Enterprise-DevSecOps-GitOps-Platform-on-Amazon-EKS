import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // -----------------------------
      // 1. Initial State
      // -----------------------------
      cart: [],

      // -----------------------------
      // 2. Actions (Mutators)
      // -----------------------------
      
      // Add item to cart (handles duplicates by increasing quantity)
      addToCart: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          // If it's a new item, ensure it has a starting quantity of 1
          set({ cart: [...currentCart, { ...item, quantity: 1 }] });
        }
      },

      // Remove an item entirely from the cart
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      // Update the quantity of a specific item (+ or -)
      updateQuantity: (id, amount) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id
              // Prevent quantity from dropping below 1 (use removeFromCart to delete)
              ? { ...item, quantity: Math.max(1, item.quantity + amount) }
              : item
          ),
        }));
      },

      // Empty the entire cart (useful for post-checkout)
      clearCart: () => set({ cart: [] }),

      // -----------------------------
      // 3. Computed Values (Helpers)
      // -----------------------------
      
      // Calculate total price of all items
      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      },

      // Calculate total number of items (useful for a navbar cart badge)
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      // -----------------------------
      // 4. Persistence Configuration
      // -----------------------------
      name: 'cravedrop-cart-storage', // The key used in the browser's localStorage
    }
  )
);

export default useCartStore;