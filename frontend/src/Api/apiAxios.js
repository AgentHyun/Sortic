// ✅ src/api/apiAxios.js
import axios from 'axios';

const apiAxios = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiAxios.interceptors.response.use((res) => res, (err) => {
  return Promise.reject(err);
});

export default apiAxios;
