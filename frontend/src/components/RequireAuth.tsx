import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RequireAuth;
