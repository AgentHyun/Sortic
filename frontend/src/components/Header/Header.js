import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Switch, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, isLoggedInAtom } from '../SorterPage/atoms/atoms';
import styles from './Header.module.css';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

const { Header } = Layout;

const SorticHeader = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const navigate = useNavigate();

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // localStorage 초기화
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('sidebarCollapsed');
    localStorage.removeItem('sortCategory');
    
    // Jotai 상태 초기화
    setIsLoggedIn(false);
    setUser(null);
    
    // 홈페이지로 이동
    navigate('/');
  };
  const navigate = useNavigate();  // useNavigate 훅 호출

  const navigateLandingPage = () => {
    navigate('/');  // 클릭 시 이동할 경로로 설정
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '프로필',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      label: '로그아웃',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  // 🚀 페이지 진입 시 이전 테마 설정 적용
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Header className={styles['header-container']}>
      <div className={styles.logo} onClick = {navigateLandingPage}>Sortic</div>
      <div className={styles['menu-container']}>
        <div className={styles['menu-item']}><Link to="/">Home</Link></div>
        <div className={styles['menu-item']}><Link to="/sorter">Sorter</Link></div>
        <div className={styles['menu-item']}>Cart</div>
        <div className={styles['menu-item']}>Q&A</div>
        <div className={styles['menu-item']}>Community</div>
      </div>
      <div className={styles['right-section']}>
        {isLoggedIn ? (
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
