import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { accessTokenAtom } from './authAtoms';

const store = getDefaultStore();

const authAxios = axios.create({
  baseURL: '/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true
});

// ✅ 요청 인터셉터: accessToken 자동 첨부
authAxios.interceptors.request.use((config) => {
  const token = store.get(accessTokenAtom) || localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ 응답 인터셉터: 만료 토큰 처리
authAxios.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) {
    const msg = err.response.data?.message || '';
    if (msg.includes('토큰')) {
      store.set(accessTokenAtom, ''); // jotai 상태 초기화
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});

export default authAxios;
