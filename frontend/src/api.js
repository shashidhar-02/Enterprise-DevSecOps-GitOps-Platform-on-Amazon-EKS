import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
});

let csrfToken;
const getCsrfToken = () => {
  csrfToken ||= api.get('/auth/csrf').then(({ data }) => data.csrfToken)
    .catch((error) => { csrfToken = undefined; throw error; });
  return csrfToken;
};
api.interceptors.request.use(async (config) => {
  if (!['get', 'head', 'options'].includes(config.method)) {
    config.headers['X-CSRF-Token'] = await getCsrfToken();
  }
  return config;
});

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => {
    if (['/auth/login', '/auth/signup', '/auth/logout'].includes(response.config.url)) csrfToken = undefined;
    return response;
  },
  (error) => {
    if (error.response?.data?.code === 'EBADCSRFTOKEN' && !error.config._csrfRetried) {
      csrfToken = undefined;
      return api.request({ ...error.config, _csrfRetried: true });
    }
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
