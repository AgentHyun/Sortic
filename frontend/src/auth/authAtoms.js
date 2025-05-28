// src/auth/authAtoms.js
import { atom } from 'jotai';

// ✅ AccessToken 상태: 로그인 인증 정보 저장
export const accessTokenAtom = atom('');

// ✅ AccessToken 설정 함수: localStorage 연동
export const setAccessTokenAtom = atom(
  null,
  (get, set, newToken) => {
    localStorage.setItem('accessToken', newToken);
    set(accessTokenAtom, newToken);
  }
);

// ✅ 로그인 여부 판단용 (Boolean)
// ✅ 원시 상태 저장
export const rawAuthenticatedAtom = atom(false);

// ✅ 읽기 전용 상태
export const isAuthenticatedAtom = atom((get) => get(rawAuthenticatedAtom));

// ✅ 쓰기 전용 상태
export const setIsAuthenticatedAtom = atom(null, (get, set, value) => {
  set(rawAuthenticatedAtom, value);
});


// ✅ [추가] 사용자 정보 저장용 (프로필 등)
export const authUserAtom = atom(null);

// ✅ [추가] 인증 로딩 상태
export const authLoadingAtom = atom(true);

// ✅ [선택] 도매 코드 열림 여부 등 UI 제어용
export const isOpenWholesaleAtom = atom(false);



