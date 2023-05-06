import { Navigate } from 'react-router-dom';
import React from 'react';
import { getUser } from '../utils';

function RequireAuth({ children }) {
    const role = getUser()?.role;
    const urlToRedirect = role ? "/home" : "/signIn";
    return role === "ADMIN" ? children : <Navigate to={urlToRedirect} replace />;
}

export default RequireAuth;
