// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider as JotaiProvider } from 'jotai';
import App from './pages/App';
import AuthProvider from './Auth/AuthProvider'; // ✅ 인증 전역 컨텍스트

import './index.css';
import './styles/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <JotaiProvider>
      <ConfigProvider>
        <BrowserRouter>
          <AuthProvider> {/* ✅ App을 여기서 감싼다 */}
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ConfigProvider>
    </JotaiProvider>
  </React.StrictMode>
);
