// src/auth/authService.js
import authAxios from '../api/authAxios';
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
      const response = await authAxios.post('/login', { userId, password });
      const { token: accessToken, refreshToken  } = response.data;

      if (!accessToken) {
        return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
      }

      setAccessToken(accessToken);
      setIsAuthenticated(true); // ✅ 로그인 상태 전역 설정

      return { success: true, user: { userId } };
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 중 오류 발생';
      return { success: false, message: msg };
    }
  };

  return login;
}

/** ✅ 로그아웃 훅 */
export function useLogout() {
  const setAccessToken = useSetAtom(setAccessTokenAtom);
  const setUser = useSetAtom(authUserAtom);
  const setIsAuthenticated = useSetAtom(setIsAuthenticatedAtom);

  const logout = async () => {
    try {
      await authAxios.post('/logout');
    } catch (_) {
      // 로그아웃 실패 무시
    } finally {
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false); // ✅ 로그아웃 상태 전역 설정
    }
  };
  return logout;
}
