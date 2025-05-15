// src/auth/AuthProvider.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { message } from 'antd';
import { useLogin, useLogout } from './authService';
import { setIsAuthenticatedAtom } from './authAtoms';
import {
  authUserAtom,
  authLoadingAtom
} from './authAtoms';

const AuthContext = createContext(null);

/** ✅ 인증 보호 및 login/logout 기능 포함한 인증 컨텍스트 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setAuthUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);

  const [localError, setLocalError] = useState(null);
  const initializedRef = useRef(false);

  const login = useLogin();
  const logout = useLogout();

  const publicPaths = ['/', '/login', '/signup'];

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialize = async () => {
      setAuthLoading(true);
      try {
        const result = await login({}); // 인증 검사 전용 (빈 객체 전달)
        if (result.success) {
          setAuthUser(result.user);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch (err) {
        handleLogout(err.message || '인증 초기화 실패');
      } finally {
        setAuthLoading(false);
      }
    };

    const handleLogout = (errorMsg) => {
      setAuthUser(null);
      setIsAuthenticated(false);
      setLocalError(errorMsg || null);
      if (!publicPaths.includes(location.pathname)) {
        navigate('/login', {
          replace: true,
          state: { from: location }
        });
      }
    };

    initialize();
  }, [login, navigate, location, setAuthUser, setIsAuthenticated, setAuthLoading]);

  return (
    <AuthContext.Provider value={{ login, logout, error: localError }}>
      {children}
    </AuthContext.Provider>
  );
};

/** ✅ 로그인 상태 접근 훅 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

