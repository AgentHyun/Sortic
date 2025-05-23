// ✅ src/auth/authProvider.js - 인증 상태 복원 전용 통합 Provider
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { message } from 'antd';
import {
  setAccessTokenAtom,
  authUserAtom,
  setIsAuthenticatedAtom,
  authLoadingAtom
} from './authAtoms';
import { reissueToken, useLogin, useLogout } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);

  const login = useLogin();
  const logout = useLogout();

  const [localError, setLocalError] = useState(null);
  const initializedRef = useRef(false);

  const publicPaths = ['/', '/login', '/signup'];

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialize = async () => {
      setAuthLoading(true);
      const result = await reissueToken(setAccessToken, setUser, setIsAuthenticated);
      if (!result.success) {
        handleLogout('토큰 재발급 실패 또는 만료');
      }
      setAuthLoading(false);
    };

    const handleLogout = (msg) => {
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      setLocalError(msg);

      if (!publicPaths.includes(location.pathname)) {
        navigate('/login', { replace: true, state: { from: location } });
      }
    };

    initialize();
  }, [setAccessToken, setUser, setIsAuthenticated, setAuthLoading, location, navigate]);

  return (
    <AuthContext.Provider value={{ login, logout, error: localError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;
