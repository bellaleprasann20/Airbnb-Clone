import axios from 'axios';

// 1. Create Axios Instance
const api = axios.create({
  // VITE FIX: Use import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Avoid infinite redirect loops if already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.error("Permission Denied: Access restricted.");
    } else if (status >= 500) {
      console.error("Server Error: Backend is down or crashing.");
    }

    return Promise.reject(error);
  }
);

export default api;