import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';
import AuthLoading from '../components/AuthLoading';

// Auth pages: already-authenticated users are sent to their dashboard.
export default function PublicOnly({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <AuthLoading />;
  if (isAuthenticated) return <Navigate to={homeForRole(user.role)} replace />;
  return children ?? <Outlet />;
}
