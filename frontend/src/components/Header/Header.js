import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Switch, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {useAtom, useSetAtom} from 'jotai';
import { authUserAtom, isAuthenticatedAtom } from '../../auth/authAtoms';
import styles from './Header.module.css';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { sorterModeAtom } from '../SorterPage/atoms/atoms';
import {generateWholesalerCodeAction} from "../WholesalePage/action/wholesaleAction";
const { Header } = Layout;

const SorticHeader = () => {
  const [user, setAuthUser] = useAtom(authUserAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();
  const setSorterMode = useSetAtom(sorterModeAtom);
  const [, generateWholesalerCode] = useAtom(generateWholesalerCodeAction);
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
  const sorterMenuItems = [
    {
      key: 'wholesale',
      label: '개인',
      onClick: () => {
        setSorterMode(0);
        navigate('/sorter');
      },
    },
    {
      key: 'wholesale',
      label: '도매',
      onClick: () => {
        setSorterMode(1);
        navigate('/sorter');
        generateWholesalerCode();

        },
    },
    {
      key: 'retail',
      label: '소매',
      onClick: () => {
        setSorterMode(2);
        navigate('/sorter');
      },
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

        <Dropdown menu={{ items: sorterMenuItems }} trigger={['hover']} placement="bottom">
          <div
            className={styles['menu-item']}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setSorterMode(0);       // sorterMode를 0으로 설정
              navigate('/sorter');    // 페이지 이동
            }}
          >
            Sorter
          </div>
        </Dropdown>

        <div className={styles['menu-item']}><Link to="/wholesale">Code</Link></div>
        <div className={styles['menu-item']}><Link to="/statistics">Statistics</Link></div>
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
