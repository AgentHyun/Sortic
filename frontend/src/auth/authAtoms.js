import { atom } from 'jotai';

// 로그인 상태
export const isAuthenticatedAtom = atom(false);

// 사용자 정보
export const authUserAtom = atom(null);

// 토큰
export const authTokenAtom = atom(null);

// 로딩 상태
export const authLoadingAtom = atom(false);

// frontend/src/auth/authService.js에 모든 인증 관련 로직 통합
export const login = async (userId, password) => {
    // 기존 로직 유지
}; 