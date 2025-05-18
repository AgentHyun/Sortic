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
      const { token: accessToken, user } = response.data;

      if (!accessToken || !user) {
        return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
      }

      setAccessToken(accessToken);
      setUser(user);
      setIsAuthenticated(true); // ✅ 로그인 상태 전역 설정

      return { success: true, user };
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














// // src/auth/AuthService.js
// import authAxios from '../api/authAxios';
//
// // 인증 관련 API 함수 그룹
// const authApi = {
//   login: async (credentials) => {
//     const response = await authAxios.post('/login', credentials);
//     return response.data;
//   },
//   validateToken: async () => {
//     const response = await authAxios.post('/validate-token');
//     return response.data;
//   },
//   logout: async () => {
//     await authAxios.post('/logout');
//   }
// };
//
// class AuthService {
//   async login(credentials) {
//     try {
//       console.log('AuthService login 요청:', credentials);
//       const response = await authAxios.post('/login', credentials);
//       console.log('AuthService 서버 응답:', response.data);
//
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         return {
//           success: true,
//           user: response.data.user
//         };
//       }
//       return {
//         success: false,
//         error: '로그인에 실패했습니다.'
//       };
//     } catch (error) {
//       console.error('AuthService 에러:', error.response || error);
//       throw error;
//     }
//   }
//
//   async logout() {
//     try {
//       await authAxios.post('/logout');
//       localStorage.removeItem('token');
//       return { success: true };
//     } catch (error) {
//       throw error;
//     }
//   }
//
//   async checkAuth() {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         return { success: false };
//       }
//
//       const response = await authAxios.post('/validate-token');
//       return {
//         success: true,
//         user: response.data.user
//       };
//     } catch (error) {
//       localStorage.removeItem('token');
//       return { success: false, error: error.message };
//     }
//   }
// }
//
// export const authService = new AuthService();
//
// // 공통 유틸 함수
// const clearAuthStorage = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   localStorage.removeItem('rememberMe');
//   localStorage.removeItem('sidebarCollapsed');
//   localStorage.removeItem('sortCategory');
// };
//
// const getCurrentUser = () => {
//   try {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   } catch {
//     localStorage.removeItem('user');
//     return null;
//   }
// };
