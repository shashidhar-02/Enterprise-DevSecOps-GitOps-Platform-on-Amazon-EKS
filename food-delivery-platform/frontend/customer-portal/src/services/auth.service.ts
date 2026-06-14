import api from './api';
import { User } from '../types/user.type';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  async login(email: string, password: string): Promise<{token: string, user: User}> {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const user = jwtDecode<User>(token);
    return { token, user };
  },
  async register(data: any): Promise<{token: string, user: User}> {
    const response = await api.post('/auth/register', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    const user = jwtDecode<User>(token);
    return { token, user };
  },
  logout() {
    localStorage.removeItem('token');
  },
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode<User>(token);
    } catch {
      return null;
    }
  }
};
