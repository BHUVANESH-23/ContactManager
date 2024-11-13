import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://contactmanager-yvwy.onrender.com', 
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


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
        const res = await axios.post('https://contactmanager-yvwy.onrender.com/api/login/refresh-token', { refreshToken });
        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('token', newAccessToken); 

          
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        
        console.error('Refresh token expired or invalid', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');

        window.location.href = '/login'; 
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
