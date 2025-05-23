// frontend/src/components/Header/SorticHeader.jsx
import React, { useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { authUserAtom, isAuthenticatedAtom } from '../../auth/authAtoms';
import { useLogout } from '../../auth/authService';
import styles from './Header.module.css';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import authAxios from "../../axios/authAxios";

import {
  selectedUserIdAtom,
  selectedUserWholesaleLinkIdAtom,
  sorterModeAtom,
  wholesalerIdAtom
} from '../SorterPage/atoms/atoms';
import {
  cloneUserWithWholesalerCodeAction,
  createWholesaleCodeAction,
  generateWholesalerCodeAction,
  fetchWholesalerCodeByUserIdAction,
  fetchClonedUserIdsAction,
  fetchClonedUserIdAction,
  getWholesaleLinkCountByUserAction
} from "../WholesalePage/action/wholesaleAction";
import {fetchAndNumberCategoriesAction} from "../SorterPage/actions/categoryAction";
const { Header } = Layout;

const SorticHeader = () => {
  const [user] = useAtom(authUserAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const logout = useLogout();
  const navigate = useNavigate();
  const setSorterMode = useSetAtom(sorterModeAtom);
  const [, generateWholesalerCode] = useAtom(generateWholesalerCodeAction);
  const cloneUserWithWholesalerCode = useSetAtom(cloneUserWithWholesalerCodeAction);
  const [selectedUserId,setSelectedUserId] = useAtom(selectedUserIdAtom);
  const [wholesalerId,setWholeSalerId] = useAtom(wholesalerIdAtom);
  const [authUser] = useAtom(authUserAtom);
  const [,createWholesaleCode] = useAtom(createWholesaleCodeAction);
  const [,fetchWholesalerCodeByUserId] = useAtom(fetchWholesalerCodeByUserIdAction);
  const [, fetchClonedUsers] = useAtom(fetchClonedUserIdAction);
  const [, fetchAndNumberCategories] = useAtom(fetchAndNumberCategoriesAction);
  const getLinkCount = useSetAtom(getWholesaleLinkCountByUserAction);
  const [selectedUserWholesaleLinkId,setSelectedUserWholesaleLinkId] = useAtom(selectedUserWholesaleLinkIdAtom);

  // ✅ 로그아웃 처리
  const handleLogout = async () => {
    const userId = user?.userId; // jotai 초기화 전에 userId 보존

    try {
      await authAxios.post('/auth/logout', { userId });
    } catch (e) {
      console.warn('백엔드 로그아웃 실패', e);
    }

    await logout(); // jotai 상태 초기화 포함
    navigate('/');
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
  const sorterMenuItems = [
    {
      key: 'wholesale',
      label: '개인',
      onClick: () => {
        setSorterMode(0);
        navigate('/sorter');
        const userId = authUser?.userId;
        setSelectedUserId(userId);
        setSelectedUserWholesaleLinkId(0);
      },
    },
    {
      key: 'wholesale',
      label: '도매',
      onClick: async () => {
        setSorterMode(1);
        navigate('/sorter');
        const code = await generateWholesalerCode();
        const userId = authUser?.userId;
        await cloneUserWithWholesalerCode(code);
        await createWholesaleCode(code);
        const clonedId = await fetchClonedUsers(userId);
        setSelectedUserId(clonedId);
        console.log("선택된 유저" + clonedId);



      },
    },
    {
      key: 'retail',
      label: '소매',
      onClick: async () => {
        setSorterMode(2);
        navigate('/sorter');
        const userId = authUser?.userId;
        setSelectedUserId(userId);
        const count = await getLinkCount(userId);
        if (count === 0) {
          navigate('/wholesale');
        }
      },
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
                <span className={styles.store_name}>{user?.storeName}</span>
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
