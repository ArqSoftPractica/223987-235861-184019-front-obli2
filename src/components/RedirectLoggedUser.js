import { Navigate } from 'react-router-dom';
import React from 'react';

function RedirectLoggedUser() {
  const isLoggedIn = localStorage.getItem('user');
    return isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/signIn" replace />;
}

export default RedirectLoggedUser;
