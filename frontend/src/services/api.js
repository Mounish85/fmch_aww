import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fmch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // When 401 Unauthorized occurs on protected operations
      if (status === 401) {
        // Dispatch an event so AuthContext can cleanly reset user state
        window.dispatchEvent(new CustomEvent('fmch:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

