import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ERROR_ROUTES = ['/login', '/register', '/404', '/403', '/401', '/500', '/maintenance', '/network-error'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (!error.response) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        const path = window.location.pathname;
        if (!ERROR_ROUTES.includes(path)) {
          window.location.href = '/network-error';
        }
      }
      return Promise.reject(error);
    }
    if (status === 401) {
      localStorage.removeItem('userInfo');
      const path = window.location.pathname;
      if (path !== '/login' && !ERROR_ROUTES.includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
