import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle expired access token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const res = await axios.post('http://localhost:5000/api/login/refresh-token', { refreshToken });
        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('token', newAccessToken); // Save the new token

          // Update the Authorization header with the new access token
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // Handle refresh token failure
        console.error('Refresh token expired or invalid', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');

        window.location.href = '/login'; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
