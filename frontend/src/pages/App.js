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
import AuthProvider from '../auth/AuthProvider';
import { authLoadingAtom } from '../auth/authAtoms';
import Snb from "../components/Snb/components/Snb";
import WholesalePage from "../components/WholesalePage/WholesalePage";

const App = () => {
  const [authLoading] = useAtom(authLoadingAtom);

  // 테마 설정
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (authLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

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
        <Route path="/sorter" element={<SorterPage />} />
        <Route path="/sorterDefaultPage" element={<SorterDefaultPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
