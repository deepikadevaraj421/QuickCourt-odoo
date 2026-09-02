import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { tokenStorage, AUTH_EVENT } from '../../shared/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState('');

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Restore session from stored token on first load.
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      if (!tokenStorage.get()) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.me();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    restore();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  // Any API call receiving 401 clears the session globally.
  useEffect(() => {
    const onUnauthorized = (event) => {
      setUser(null);
      setSessionMessage(event.detail?.message || 'Your session has expired. Please log in again.');
    };
    window.addEventListener(AUTH_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_EVENT, onUnauthorized);
  }, []);

  const applySession = useCallback(({ token, user: nextUser }) => {
    tokenStorage.set(token);
    setUser(nextUser);
    setSessionMessage('');
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => applySession(await authService.login(credentials)), [applySession]);

  const verifyOtp = useCallback(async (payload) => applySession(await authService.verifyOtp(payload)), [applySession]);

  const register = useCallback((payload) => authService.register(payload), []);

  const resendOtp = useCallback((payload) => authService.resendOtp(payload), []);

  const logout = useCallback(async () => {
    try {
      if (tokenStorage.get()) await authService.logout();
    } catch {
      // Token may already be invalid; local session is cleared regardless.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isVerified: Boolean(user?.isVerified),
      loading,
      sessionMessage,
      clearSessionMessage: () => setSessionMessage(''),
      login,
      register,
      verifyOtp,
      resendOtp,
      logout
    }),
    [user, loading, sessionMessage, login, register, verifyOtp, resendOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
