// src/components/ProtectedRoute.js
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom, authLoadingAtom } from '../auth/AuthAtoms';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * 인증이 필요한 라우트 보호 컴포넌트
 * - 로딩 중: null 반환 (라우팅 보류)
 * - 미인증: /login 페이지로 이동 (현재 위치를 state에 저장)
 * - 인증됨: children 컴포넌트 렌더링
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const authLoading = useAtomValue(authLoadingAtom);
  const location = useLocation();

  // 1. 인증 로딩 중이면 아무 것도 렌더링하지 않음
  if (authLoading) {
    return null;
  }

  // 2. 인증되지 않은 경우에만 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
