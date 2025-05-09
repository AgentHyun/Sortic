// ✅ src/api/authAxios.js
import axios from 'axios';

const authAxios = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

// 요청 인터셉터
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터
authAxios.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) {
    // 토큰이 만료되었거나 유효하지 않은 경우
    const errorMessage = err.response.data?.message || err.response.data;
    if (errorMessage === '토큰 만료' || errorMessage === '토큰 무효' || errorMessage === '토큰 누락') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

export default authAxios;
