import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
});

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
