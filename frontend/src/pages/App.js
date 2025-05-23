// src/pages/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAtomValue } from 'jotai';
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

import { authLoadingAtom } from '../auth/authAtoms';

const App = () => {
  const authLoading = useAtomValue(authLoadingAtom); // ✅ 인증 로딩 여부

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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
