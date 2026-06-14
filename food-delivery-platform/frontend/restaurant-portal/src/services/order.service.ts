import api from './api';

export const orderService = {
  async createOrder(data: any) {
    const response = await api.post('/orders', data);
    return response.data;
  },
  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },
  async getOrderById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};
