import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Spin } from 'antd';

import SorticHeader from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import LoginPage from '../components/LoginPage/LoginPage';
import SignupPage from '../components/SignupPage/SignupPage';
import SorterPageComponent from '../components/SorterPage/components/SorterPage';
import SorterDefaultPage from '../components/SorterPage/components/SorterDefaultPage';
import ProfilePage from '../components/ProfilePage/components/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';
import WholesalePage from '../components/WholesalePage/WholesalePage';
import Snb from '../components/Snb/components/Snb';

import {
  authLoadingAtom,
  setAccessTokenAtom,
  authUserAtom,
  setIsAuthenticatedAtom,
} from '../auth/authAtoms';
import publicAxios from '../api/publicAxios';

const App = () => {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);
  const authLoading = useAtomValue(authLoadingAtom); // 조회 전용
  const setAuthLoading = useSetAtom(authLoadingAtom); // setter만 따로

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const restoreLoginState = async () => {
      try {
        const response = await publicAxios.post('/auth/reissue');
        const { accessToken, user } = response.data;

        if (accessToken && user) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('userId', user.userId); // 선택적
          setAccessToken(accessToken);
          setUser(user);
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid token response');
        }
      } catch (err) {
        // ✅ 실패 시 강제 로그아웃 처리
        setAccessToken('');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
      } finally {
        setAuthLoading(false);
      }
    };

    restoreLoginState();
  }, []);


  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <Spin tip="인증 확인 중입니다..." size="large" />
      </div>
    );
  }

  return (
    <>
      <SorticHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/sorter"
          element={
            <ProtectedRoute>
              <SorterPageComponent />
              <Snb />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sorterDefaultPage"
          element={
            <ProtectedRoute>
              <SorterDefaultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/wholesale" element={<WholesalePage />} />
      </Routes>
    </>
  );
};

export default App;
