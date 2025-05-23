// src/api/authAxios.js
import axios from 'axios';

const authAxios = axios.create({
  baseURL: '/api', // ✅ 프록시 기준 경로
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

// ✅ 인증이 필요 없는 경로 (부분 매칭 가능성 고려)
const noAuthPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/reissue',
  '/users/check-userid',
  '/users/check-store',
  '/email/send-code',
  '/email/verify-code'
];

// ✅ 요청 인터셉터
authAxios.interceptors.request.use((config) => {
  const path = config.url?.replace(config.baseURL || '', '') || '';
  const isPublic = noAuthPaths.some((p) => path.startsWith(p));
  if (isPublic) return config;

  const token = localStorage.getItem('accessToken'); // ✅ 정확한 key 사용
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ 응답 인터셉터
authAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const msg = err.response.data?.message || '';
      if (msg.includes('토큰')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default authAxios;
