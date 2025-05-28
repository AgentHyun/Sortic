// ✅ src/auth/authService.js - 최종 리팩토링 버전
import authAxios from '../axios/authAxios';
import { useSetAtom } from 'jotai';
import {
  setAccessTokenAtom,
  authUserAtom,
  setIsAuthenticatedAtom
} from './authAtoms';

/** ✅ 로그인 */
export const useLogin = () => {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);

  return async ({ userId, password }) => {
    try {
      const res = await authAxios.post('/auth/login', { userId, password });
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.userId);

      await Promise.resolve(); // microtask queue 삽입

      setAccessToken(accessToken);
      setUser(user);
      setIsAuthenticated(true);

      return {
        success: true,
        user, // ✅ 사용자 정보 리턴
      };
    } catch (err) {
      console.error('❌ 로그인 실패:', err);
      return {
        success: false,
        message: err?.response?.data?.message || '로그인 중 오류가 발생했습니다.',
      };
    }
  };
};

/** ✅ 로그아웃 */
export const useLogout = () => {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);

  return async () => {
    const userId = localStorage.getItem('userId');
    await authAxios.post('/auth/logout', { userId });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    setAccessToken('');
    setUser(null);
    setIsAuthenticated(false);
  };
};

/** ✅ 토큰 재발급 */
export const reissueToken = async (setAccessToken, setUser, setIsAuthenticated) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return { success: false };

    const res = await authAxios.post('/auth/reissue', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, user } = res.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('userId', user.userId);

    setAccessToken(accessToken);
    setUser(user);
    setIsAuthenticated(true);

    return { success: true };
  } catch (e) {
    console.error('🔁 reissueToken 실패:', e);
    return { success: false };
  }
};
