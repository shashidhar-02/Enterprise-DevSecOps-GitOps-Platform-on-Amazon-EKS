import { create } from 'zustand';
import { User } from '../types/user.type';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: !!authService.getCurrentUser(),
  login: async (email: string, pass: string) => {
    const { user } = await authService.login(email, pass);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user, isAuthenticated: !!user })
}));
