import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with auth handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Profile API functions
export const updateProfile = async (userData: { name: string; email: string }) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

// Data export API functions
export const exportUserData = async (format: 'csv' | 'json', includeNotifications = false) => {
  const response = await api.get('/api/users/export', {
    params: { format, includeNotifications },
    responseType: 'blob',
  });
  
  // Create download link
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `user-data.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  return response.data;
};

export default api;