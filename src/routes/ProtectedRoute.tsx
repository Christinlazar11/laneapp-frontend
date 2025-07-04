import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  redirectIfAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectIfAuth }) => {
  const token = localStorage.getItem('admin_token');
  if (redirectIfAuth && token) {
    return <Navigate to="/dashboard" replace />;
  }
  if (!redirectIfAuth && !token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute; 