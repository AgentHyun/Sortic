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
  selectedUserIdAtom, selectedUserNameAtom,
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
  getWholesaleLinkCountByUserAction,
  fetchUserWholesaleCodesAction,
  getUserIdsByUserWholesaleCodeAction,
  getUsernameByUserIdAction
} from "../WholesalePage/action/wholesaleAction";
import {fetchAndNumberCategoriesAction} from "../SorterPage/actions/categoryAction";
const { Header } = Layout;

const SorticHeader = () => {
  const [user] = useAtom(authUserAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const logout = useLogout();
  const navigate = useNavigate();
  const setSorterMode = useSetAtom(sorterModeAtom);
  const [, generateWholesalerCode] = useAtom(generateWholesalerCodeAction);
  const cloneUserWithWholesalerCode = useSetAtom(cloneUserWithWholesalerCodeAction);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);
  const [wholesalerId, setWholeSalerId] = useAtom(wholesalerIdAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [, createWholesaleCode] = useAtom(createWholesaleCodeAction);
  const [, fetchWholesalerCodeByUserId] = useAtom(fetchWholesalerCodeByUserIdAction);
  const [, fetchClonedUsers] = useAtom(fetchClonedUserIdAction);
  const [, fetchAndNumberCategories] = useAtom(fetchAndNumberCategoriesAction);
  const getLinkCount = useSetAtom(getWholesaleLinkCountByUserAction);
  const [selectedUserWholesaleLinkId, setSelectedUserWholesaleLinkId] = useAtom(selectedUserWholesaleLinkIdAtom);
  const [, fetchUserWholesaleCodes] = useAtom(fetchUserWholesaleCodesAction);
  const [, getUserIdsByUserWholesaleCode] = useAtom(getUserIdsByUserWholesaleCodeAction);
  const [, getUsernameByUserId] = useAtom(getUsernameByUserIdAction);
  const [selectedUsername, setSelectedUserName] = useAtom(selectedUserNameAtom);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  // 로그아웃 처리 함수


    // ✅ 로그아웃 처리
    const handleLogout = async () => {
      const userId = user?.userId; // jotai 초기화 전에 userId 보존

      try {
        await authAxios.post('/auth/logout', {userId});
      } catch (e) {
        console.warn('백엔드 로그아웃 실패', e);
      }

      await logout(); // jotai 상태 초기화 포함
      navigate('/');
    };

    const userMenuItems = [
      {
        key: 'profile',
        label: '프로필',
        icon: <UserOutlined/>,
        onClick: () => navigate('/profile'),
      },
      {
        key: 'logout',
        label: '로그아웃',
        icon: <LogoutOutlined/>,
        onClick: handleLogout,
      },
    ];
    const sorterMenuItems = [
      {
        key: 'personal',
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

          const count = await getLinkCount(userId);
          if (count === 0) {
            navigate('/wholesale');
          }
          const result = await fetchUserWholesaleCodes();
          const firstCode = result?.[0]?.userWholesaleCode;
          setSelectedUserWholesaleLinkId(firstCode);
          fetchAndNumberCategories(firstCode);
          const userIds = await getUserIdsByUserWholesaleCode(firstCode);
          const firstUserId = userIds?.[0];
          const firstUserName = await getUsernameByUserId(firstUserId);
          setSelectedUserName(firstUserName);
          const clonedId = await fetchClonedUsers(firstUserId);

          setSelectedUserId(clonedId);


        },
      },
    ];


    return (
      <Header className={styles['header-container']}>
        <div className={styles.logo}>Sortic</div>

        <div className={styles['menu-container']}>
          <div className={styles['menu-item']}><Link to="/">Home</Link></div>

          <Dropdown menu={{items: sorterMenuItems}} trigger={['hover']} placement="bottom">
            <div
              className={styles['menu-item']}
              style={{cursor: 'pointer'}}
              onClick={() => {
                setSorterMode(0);       // sorterMode를 0으로 설정
                navigate('/sorter');    // 페이지 이동
              }}
            >
              Sorter
            </div>
          </Dropdown>

          <div className={styles['menu-item']}><Link to="/wholesale">Code</Link></div>

        </div>

        <div className={styles['right-section']}>
          {isAuthenticated ? (
            <>
              <Badge dot>
                <BellOutlined className={styles['notification-icon']}/>
              </Badge>
              <Dropdown menu={{items: userMenuItems}} placement="bottomRight">
                <div className={styles['user-info']}>
                  <Avatar icon={<UserOutlined/>} className={styles.avatar}/>
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
          <ThemeSwitch className={styles.themeSwitch}/>
        </div>
      </Header>
    );
  };

export default SorticHeader;
