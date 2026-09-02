import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shared logout used by USER, OWNER and ADMIN shells:
// clears the session, then always lands on /login.
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return useCallback(async () => {
    await logout();
    navigate('/login', { replace: true, state: { notice: 'You have been logged out.' } });
  }, [logout, navigate]);
}

export default useLogout;
