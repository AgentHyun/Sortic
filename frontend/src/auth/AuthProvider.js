// frontend/src/auth/AuthProvider.js
import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authService } from './AuthService';
import { useSetAtom } from 'jotai';
import {
  authUserAtom,
  isAuthenticatedAtom,
  authLoadingAtom
} from './AuthAtoms';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setAuthUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);

  const [localError, setLocalError] = useState(null);
  const initializedRef = useRef(false);

  const publicPaths = ['/', '/login', '/signup'];

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeAuth = async () => {
      setAuthLoading(true);
      try {
        const result = await authService.checkAuth();

        if (result.success) {
          setAuthUser(result.user);
          setIsAuthenticated(true);
        } else {
          setAuthUser(null);
          setIsAuthenticated(false);

          if (!publicPaths.includes(location.pathname)) {
            navigate('/login', { 
              replace: true,
              state: { from: location }
            });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setLocalError(err.message || '인증 초기화 실패');
        setAuthUser(null);
        setIsAuthenticated(false);

        if (!publicPaths.includes(location.pathname)) {
          navigate('/login', { 
            replace: true,
            state: { from: location }
          });
        }
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /** 로그인 */
  const login = async (userId, password, rememberMe) => {
    try {
      const result = await authService.login(userId, password, rememberMe);

      if (result.success) {
        setAuthUser(result.user);
        setIsAuthenticated(true);
        setLocalError(null);
        navigate('/sorter', { replace: true });
        return { success: true };
      } else {
        const errorMsg = result.error || '로그인 실패';
        setLocalError(errorMsg);
        message.error(errorMsg);
        return { success: false, error: errorMsg };
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
      navigate('/login', { replace: true });
    } catch (err) {
      const errorMsg = '로그아웃 중 오류가 발생했습니다.';
      setLocalError(errorMsg);
      message.error(errorMsg);
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
