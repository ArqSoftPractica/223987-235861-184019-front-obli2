import { Navigate } from 'react-router-dom';
import React from 'react';

function RequireAuth({ children }) {
    const isLoggedIn = !!localStorage.getItem('user');
    return isLoggedIn === true ? children : <Navigate to="/signIn" replace />;
}

export default RequireAuth;
