// frontend/src/Auth/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authService } from './AuthService';
import { useSetAtom } from 'jotai';
import { authUserAtom, isAuthenticatedAtom, authLoadingAtom } from './AuthAtoms';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // jotai 전역 상태 업데이트 함수들
  const setAuthUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);

  const [localError, setLocalError] = useState(null);

  /** 초기 인증 상태 확인 */
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true); // 로딩 시작
      try {
        const result = await authService.checkAuth();
        if (result.success) {
          setAuthUser(result.user);
          setIsAuthenticated(true);
        } else {
          setAuthUser(null);
          setIsAuthenticated(false);
          if (!pathname.includes('/login')) {
            message.error('로그인이 필요합니다.');
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setLocalError(err.message);
        setAuthUser(null);
        setIsAuthenticated(false);
        if (!pathname.includes('/login')) {
          message.error('로그인이 필요합니다.');
          navigate('/login');
        }
      } finally {
        setAuthLoading(false); // 로딩 종료
      }
    };

    // 초기 진입 시 한 번만 실행
    initializeAuth();
  }, []); // ✅ 절대로 pathname 넣지 않음!

  /** 로그인 */
  const login = async (userId, password, rememberMe) => {
    try {
      const result = await authService.login(userId, password, rememberMe);
      if (result.success) {
        setAuthUser(result.user);
        setIsAuthenticated(true);
        setLocalError(null);
        navigate('/sorter');
        return { success: true };
      } else {
        setLocalError(result.error);
        message.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setLocalError(errorMessage);
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /** 로그아웃 */
  const logout = async () => {
    try {
      await authService.logout();
      setAuthUser(null);
      setIsAuthenticated(false);
      setLocalError(null);
      navigate('/login');
    } catch (err) {
      setLocalError('로그아웃 중 오류가 발생했습니다.');
      message.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, error: localError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
