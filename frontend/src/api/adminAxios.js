// ✅ src/api/adminAxios.js
import axios from 'axios';

const adminAxios = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

adminAxios.interceptors.response.use((res) => res, (err) => {
  return Promise.reject(err);
});

export default adminAxios;
