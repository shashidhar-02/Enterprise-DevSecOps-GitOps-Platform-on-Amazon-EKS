import { create } from 'zustand';

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.menuItemId === item.menuItemId);
    const newItems = existing 
      ? state.items.map(i => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i)
      : [...state.items, item];
    return { items: newItems, total: newItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) };
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(i => i.id !== id);
    return { items: newItems, total: newItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) };
  }),
  clearCart: () => set({ items: [], total: 0 })
}));
