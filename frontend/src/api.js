import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor: Attach tokens from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cravedrop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cravedrop_token');
      const isAuthMe = error.config?.url?.includes('/auth/me');
      const isAuthPage = window.location.pathname === '/auth' || window.location.pathname === '/';
      if (!isAuthMe && !isAuthPage) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;