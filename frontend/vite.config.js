import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Allows access from the network (crucial for Docker local dev)
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      // Routes all frontend /api requests to your local Node.js backend
      '/api': {
        target: 'http://127.0.0.1:5000', 
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});