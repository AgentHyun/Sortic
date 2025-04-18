// src/pages/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SorticHeader from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import SorterPage from '../components/SorterPage/components/SorterPage';
import LoginPage from '../components/LoginPage/LoginPage';
import SignupPage from '../components/SignupPage/SignupPage';
import SorterDefaultPage from '../components/SorterPage/components/SorterDefaultPage';

const App = () => {
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <SorticHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/sorter" element={<SorterPage />} />
        <Route path="/sorterDefaultPage" element={<SorterDefaultPage />} />
      </Routes>
    </>
  );
};

export default App;
