// src/auth/AuthAtoms.js
import { atom } from 'jotai';

// 로그인한 유저 정보
export const authUserAtom = atom(null);

// 로그인 인증 여부
export const isAuthenticatedAtom = atom(false);

// 로그인 로딩 상태
export const authLoadingAtom = atom(false);

// 인증 토큰
export const authTokenAtom = atom(null);

// 로그인 폼 입력 상태
export const loginFormAtom = atom({
  userId: '',
  password: '',
  rememberMe: false,
});

// 로그인 폼 에러 상태
export const loginErrorAtom = atom({
  userIdError: '',
  passwordError: '',
  submitError: '',
});
