// src/auth/authService.js
import publicAxios from '../api/publicAxios';
import { useSetAtom } from 'jotai';
import {
  setAccessTokenAtom,
  authUserAtom,
  setIsAuthenticatedAtom
} from './authAtoms';

/** ✅ 로그인 훅 */
export function useLogin() {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);

  const login = async ({ userId, password }) => {
    try {
      const response = await publicAxios.post('/auth/login', { userId, password });
      const { accessToken, user } = response.data;

      if (!accessToken || !user) {
        return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
      }

      setAccessToken(accessToken);
      setUser(user); // ✅ 전체 유저 정보 저장
      setIsAuthenticated(true); // ✅ 로그인 상태 전역 설정

      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 중 오류 발생';
      return { success: false, message: msg };
    }
  };
  return login;
}

export async function reissueToken() {
  try {
    const response = await publicAxios.post('/auth/reissue');
    const { accessToken, user } = response.data;

    if (accessToken && user) {
      return { success: true, accessToken, user };
    } else {
      return { success: false };
    }
  } catch (err) {
    return { success: false };
  }
}

/** ✅ 로그아웃 훅 */
export function useLogout() {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);

  const logout = async () => {
    try {
      await publicAxios.post('/auth/logout', {
        userId: localStorage.getItem('userId'), // ✅ 백엔드 로그아웃용
      });
    } catch (_) {
      // 실패 무시
    } finally {
      // ✅ 상태 초기화
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false);

      // ✅ localStorage 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
    }
  };

  return logout;
}
