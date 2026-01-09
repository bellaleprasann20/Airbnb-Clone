import api from './api';

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};