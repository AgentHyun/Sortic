import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/auth',  // 백엔드 서버 주소로 수정
  timeout: 5000,         // 요청 타임아웃 5초
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios 요청 설정:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios 응답:', response.data);
    return response;
  },
  async (error) => {
    console.error('Axios 응답 에러:', error.response || error);
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
