import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { isAuthenticatedAtom, authUserAtom, authLoadingAtom } from './authAtoms';
import { getCurrentUser, validateToken } from './authService';

const AuthProvider = ({ children }) => {
    const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [, setAuthUser] = useAtom(authUserAtom);
    const [, setAuthLoading] = useAtom(authLoadingAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            setAuthLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                // 토큰 유효성 검사
                const isValid = await validateToken();
                if (!isValid) {
                    throw new Error('Invalid token');
                }

                // 사용자 정보 복원
                const user = getCurrentUser();
                if (user) {
                    setIsAuthenticated(true);
                    setAuthUser(user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                // 로그인 페이지에서는 에러 메시지 표시하지 않음
                if (!window.location.pathname.includes('/login')) {
                    message.error('로그인이 필요합니다.');
                }
                localStorage.clear();
                setIsAuthenticated(false);
                setAuthUser(null);
                navigate('/login');
            } finally {
                setAuthLoading(false);
            }
        };

        initializeAuth();
    }, [setIsAuthenticated, setAuthUser, setAuthLoading, navigate]);

    return children;
};

export default AuthProvider; 