// src/auth/authService.js
import publicAxios from '../axios/publicAxios';
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
      localStorage.removeItem('accessToken'); // 기존 토큰 제거

      const res = await publicAxios.post('/auth/login', { userId, password });
      const { accessToken, user } = res.data;

      if (!accessToken || !user) {
        return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
      }

      // 상태 및 로컬 동기화
      setAccessToken(accessToken);
      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', user.userId);

      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 중 오류 발생';
      return { success: false, message: msg };
    }
  };

  return login;
}

/** ✅ 토큰 재발급 + 상태 동기화 (App, AuthProvider 등에서 호출용) */
export async function reissueToken(setAccessToken, setUser, setIsAuthenticated) {
  try {
    const res = await publicAxios.post('/auth/reissue');
    const { accessToken, user } = res.data;

    if (accessToken && user) {
      setAccessToken(accessToken);
      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', user.userId);

      return { success: true };
    }

    return { success: false };
  } catch {
    // 상태 초기화
    setAccessToken('');
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
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
      const userId = localStorage.getItem('userId');
      if (userId) {
        await publicAxios.post('/auth/logout', { userId });
      }
    } catch {
      // 실패 무시
    } finally {
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
    }
  };

  return logout;
}
