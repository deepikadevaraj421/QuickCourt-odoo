import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';
import AuthLoading from '../components/AuthLoading';

// Blocks unauthenticated users (-> /login) and wrong-role users (-> their own dashboard).
export default function RequireAuth({ roles, children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace state={{ home: homeForRole(user.role) }} />;
  }

  return children ?? <Outlet />;
}
