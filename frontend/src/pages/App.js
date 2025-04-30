// src/pages/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAtom } from 'jotai';

import SorticHeader from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import SorterPage from '../components/SorterPage/components/SorterPage';
import LoginPage from '../components/LoginPage/LoginPage';
import SignupPage from '../components/SignupPage/SignupPage';
import SorterDefaultPage from '../components/SorterPage/components/SorterDefaultPage';
import ProfilePage from '../components/ProfilePage/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthProvider from '../Auth/AuthProvider';

import { authLoadingAtom } from '../Auth/AuthAtoms';

const App = () => {
  const [authLoading] = useAtom(authLoadingAtom); // ✅ 상태만 구독, 인증 확인은 하지 않음

  // [1] 다크 모드 초기화
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // [2] 인증 확인 중이면 로딩 출력
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // [3] 인증 확인 이후 라우트 렌더링
  return (
    <AuthProvider>
      <SorticHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
      </Routes>
    </AuthProvider>
  );
};

export default App;
