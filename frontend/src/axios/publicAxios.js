// ✅ src/api/publicAxios.js
import axios from 'axios';

const publicAxios = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

// ❌ 요청 인터셉터 없음 (토큰 불필요)
export default publicAxios;
