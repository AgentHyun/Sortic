// src/auth/AuthService.js
import axiosInstance from '../Api/AxiosInstance';

// 인증 관련 API 함수 그룹
const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },
  validateToken: async () => {
    const response = await axiosInstance.post('/validate-token');
    return response.data;
  },
  logout: async () => {
    await axiosInstance.post('/logout');
  }
};

class AuthService {
  async login(credentials) {
    try {
      console.log('AuthService login 요청:', credentials);
      const response = await axiosInstance.post('/login', credentials);
      console.log('AuthService 서버 응답:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return {
          success: true,
          user: response.data.user
        };
      }
      return {
        success: false,
        error: '로그인에 실패했습니다.'
      };
    } catch (error) {
      console.error('AuthService 에러:', error.response || error);
      throw error;
    }
  }

  async logout() {
    try {
      await axiosInstance.post('/logout');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const response = await axiosInstance.post('/validate-token');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      localStorage.removeItem('token');
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();

// 공통 유틸 함수
const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('sidebarCollapsed');
  localStorage.removeItem('sortCategory');
};

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};
