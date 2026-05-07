// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
  timeout: 30000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('nq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nq_token');
      localStorage.removeItem('nq_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
