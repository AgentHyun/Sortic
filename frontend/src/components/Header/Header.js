import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Switch } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../SorterPage/atoms/atoms';
import styles from './Header.module.css';

const { Header } = Layout;

const SorticHeader = () => {
  const [user] = useAtom(userAtom);

  // 🌙 다크모드 토글
  const toggleTheme = (checked) => {
    console.log('[다크모드 토글됨]', checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  const navigate = useNavigate();  // useNavigate 훅 호출

  const navigateLandingPage = () => {
    navigate('/');  // 클릭 시 이동할 경로로 설정
  };

  // 🚀 페이지 진입 시 이전 설정 적용
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
        <Badge dot>
          <BellOutlined className={styles['notification-icon']} />
        </Badge>
        <Avatar icon={<UserOutlined />} className={styles.avatar} />
        <span className={styles.username}>{user.nickname || 'Guest'}</span>
        <Switch
          onChange={toggleTheme}
          defaultChecked={localStorage.getItem('theme') === 'dark'}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          className={styles.themeSwitch}
        />
      </div>
    </Header>
  );
};

export default SorticHeader;
