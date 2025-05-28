// src/api/authAxios.js
import axios from 'axios';

const authAxios = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// 로그인 등 예외 경로
const noAuthPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/reissue',
  '/users/check-userid',
  '/users/check-store',
  '/email/send-code',
  '/email/verify-code',
];

authAxios.interceptors.request.use((config) => {
  const path = config.url?.replace(config.baseURL || '', '') || '';
  const isPublic = noAuthPaths.some((p) => path.startsWith(p));
  if (!isPublic) {
    const token = localStorage.getItem('accessToken');
    console.log('[authAxios] 실제 요청에 사용된 토큰:', token); // ← 여기에 출력되는지 확인!
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

authAxios.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) {
    const msg = err.response.data?.message || '';
    if (msg.includes('토큰')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

export default authAxios;
