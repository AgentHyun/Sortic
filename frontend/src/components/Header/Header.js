import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Switch, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authUserAtom, isAuthenticatedAtom } from '../../auth/AuthAtoms';
import styles from './Header.module.css';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

const { Header } = Layout;

const SorticHeader = () => {
  const [user, setAuthUser] = useAtom(authUserAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('sidebarCollapsed');
    localStorage.removeItem('sortCategory');

    // jotai 상태 초기화
    setAuthUser(null);
    setIsAuthenticated(false);

    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '프로필',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: '로그아웃',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Header className={styles['header-container']}>
      <div className={styles.logo}>Sortic</div>

      <div className={styles['menu-container']}>
        <div className={styles['menu-item']}><Link to="/">Home</Link></div>
        <div className={styles['menu-item']}><Link to="/sorter">Sorter</Link></div>
        <div className={styles['menu-item']}>Cart</div>
        <div className={styles['menu-item']}>Q&A</div>
        <div className={styles['menu-item']}>Community</div>
      </div>

      <div className={styles['right-section']}>
        {isAuthenticated ? (
          <>
            <Badge dot>
              <BellOutlined className={styles['notification-icon']} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className={styles['user-info']}>
                <Avatar icon={<UserOutlined />} className={styles.avatar} />
                <span className={styles.username}>{user?.username || 'Guest'}</span>
              </div>
            </Dropdown>
          </>
        ) : (
          <div className={styles['auth-buttons']}>
            <Link to="/login" className={styles['auth-link']}>로그인</Link>
            <Link to="/signup" className={styles['auth-link']}>회원가입</Link>
          </div>
        )}
        <ThemeSwitch className={styles.themeSwitch} />
      </div>
    </Header>
  );
};

export default SorticHeader;
