import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/context/AuthContext';
import RequireAuth from './auth/guards/RequireAuth';
import PublicOnly from './auth/guards/PublicOnly';
import AuthLoading from './auth/components/AuthLoading';
import LoginPage from './auth/pages/LoginPage';
import RegisterPage from './auth/pages/RegisterPage';
import VerifyOtpPage from './auth/pages/VerifyOtpPage';
import UnauthorizedPage from './auth/pages/UnauthorizedPage';
import { ROLES, homeForRole } from './auth/utils/roles';
import UserRoutes from './modules/user/routes/UserRoutes';
import OwnerRoutes from './modules/owner/routes/OwnerRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';

// "/" and unknown paths: send to the role dashboard when logged in, else /login.
function RootRedirect() {
  const { loading, isAuthenticated, user } = useAuth();
  if (loading) return <AuthLoading />;
  return <Navigate to={isAuthenticated ? homeForRole(user.role) : '/login'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
          </Route>

          <Route path="/unauthorized" element={<RequireAuth><UnauthorizedPage /></RequireAuth>} />

          {/* Role-protected modules */}
          <Route element={<RequireAuth roles={[ROLES.USER, ROLES.ADMIN]} />}>
            <Route path="/user/*" element={<UserRoutes />} />
          </Route>
          <Route element={<RequireAuth roles={[ROLES.OWNER, ROLES.ADMIN]} />}>
            <Route path="/owner/*" element={<OwnerRoutes />} />
          </Route>
          <Route element={<RequireAuth roles={[ROLES.ADMIN]} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
