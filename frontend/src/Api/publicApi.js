//frontend/src/Api/publicApi.js
import axios from 'axios';

const publicApi = axios.create({
  baseURL: '/api/auth',     // 로그인·리프레시·회원가입 전용
  withCredentials: true,    // Refresh-Token 쿠키 주고받기
  headers: { 'Content-Type': 'application/json' }
});

export default publicApi;
