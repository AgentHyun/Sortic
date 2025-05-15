// frontend/src/components/Header/SorticHeader.jsx
import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authUserAtom, isAuthenticatedAtom } from '../../auth/authAtoms';
import { useLogout } from '../../auth/authService';
import styles from './Header.module.css';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

const { Header } = Layout;

const SorticHeader = () => {
  const [user] = useAtom(authUserAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const logout = useLogout();
  const navigate = useNavigate();

  // ✅ 로그아웃 처리
  const handleLogout = async () => {
    await logout(); // jotai 상태 초기화 포함
    navigate('/');  // 홈으로 이동
  };

  // ✅ 유저 드롭다운 메뉴
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

  // ✅ 다크모드 테마 반영
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
        <div className={styles['menu-item']}><Link to="/wholesale">Code</Link></div>
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
                <span className={styles.store_name}>{user?.store_name}</span>
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
