// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as JotaiProvider } from 'jotai';
import { ConfigProvider } from 'antd';

import App from './pages/App';
import AuthProvider from './auth/authProvider';

import './index.css';
import './styles/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <JotaiProvider>
        <ConfigProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ConfigProvider>
      </JotaiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
