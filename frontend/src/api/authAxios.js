import axios from 'axios';

const authAxios = axios.create({
  baseURL: '/api', // 프록시 통과용
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

const noAuthPaths = [
  '/users/signup',
  '/users/login',
  '/users/check-userid',
  '/users/check-store',
  '/email/send-code',
  '/email/verify-code'
];

// 요청 인터셉터
authAxios.interceptors.request.use((config) => {
  const isPublic = noAuthPaths.some(path => config.url?.includes(path));
  if (isPublic) return config;

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 응답 인터셉터
authAxios.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) {
    const msg = err.response.data?.message || err.response.data;
    if (msg?.includes('토큰')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

export default authAxios;
