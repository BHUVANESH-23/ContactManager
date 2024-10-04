// Axios setup with interceptors for handling access token refresh
import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle expired access token
axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  // If the access token has expired
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // Try to refresh the access token
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const res = await axios.post('http://localhost:5000/api/refresh-token', { refreshToken });
      
      if (res.status === 200) {
        // Update local storage with new access token
        localStorage.setItem('accessToken', res.data.accessToken);

        // Retry the original request with the new token
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest);
      }
    } catch (err) {
      console.error('Failed to refresh token', err);
    }
  }

  return Promise.reject(error);
});

export default axiosInstance;
