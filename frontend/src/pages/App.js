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

import { authLoadingAtom } from '../Auth/AuthAtoms';

const App = () => {
  const [authLoading] = useAtom(authLoadingAtom); // ✅ AuthProvider에서 설정된 전역 로딩 상태만 구독

  // [1] 다크 모드 초기화 (최초 렌더링 시 한 번만 실행)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // [2] 인증 확인 중일 땐 로딩 화면만 렌더링 (라우팅 안 됨)
  if (authLoading) {
    return <div>Loading...</div>; // TODO: 스피너 컴포넌트로 교체 가능
  }

  // [3] 인증 확인 완료 후 앱 라우트 렌더링
  return (
    <>
      <SorticHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 인증된 사용자만 접근 가능한 라우트 */}
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
    </>
  );
};

export default App;
