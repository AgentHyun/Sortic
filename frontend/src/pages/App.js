// src/pages/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Spin } from 'antd';

import SorticHeader from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import SorterPage from '../components/SorterPage/components/SorterPage';
import LoginPage from '../components/LoginPage/LoginPage';
import SignupPage from '../components/SignupPage/SignupPage';
import SorterPage from '../components/SorterPage/components/SorterPage';
import SorterDefaultPage from '../components/SorterPage/components/SorterDefaultPage';
import ProfilePage from '../components/ProfilePage/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthProvider from '../auth/AuthProvider';
import { authLoadingAtom } from '../auth/AuthAtoms';
import Snb from "../components/Snb/components/Snb";
import WholesalePage from "../components/WholesalePage/WholesalePage";

const App = () => {
  const [authLoading] = useAtom(authLoadingAtom);

  // ✅ 다크 모드 초기화 (최초 1회만 실행)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // ✅ 인증 확인 중이면 로딩 표시
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <Spin tip="인증 확인 중입니다..." size="large" />
      </div>
    );
  }

  // ✅ 인증 확인 후 라우팅 렌더
  return (
    <AuthProvider>
      <SorticHeader />
      <Routes>
        {/* ✅ 공개 접근 가능 페이지 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ 로그인 필요 페이지 */}
        <Route
          path="/sorter"
          element={
            <ProtectedRoute>
              <SorterPage />
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
        <Route
          path="/sorter"
          element={
            <ProtectedRoute>
              <SorterPage />
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
        <Route path="/sorter" element={<SorterPage />} />
        <Route path="/sorterDefaultPage" element={<SorterDefaultPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
