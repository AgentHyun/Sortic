import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '../Auth/AuthAtoms'; // ✅ 여기를 변경

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn] = useAtom(isAuthenticatedAtom);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
