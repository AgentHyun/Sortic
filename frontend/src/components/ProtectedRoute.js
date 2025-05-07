import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isLoggedInAtom } from './SorterPage/atoms/atoms';

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn] = useAtom(isLoggedInAtom);
    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute; 