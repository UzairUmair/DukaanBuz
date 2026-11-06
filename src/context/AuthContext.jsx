import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../api/client.js';
import { getCurrentUser, loginUser, registerUser } from '../api/authApi.js';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!getStoredToken()) return setLoading(false);
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    restore();
    const onUnauthorized = () => logout();
    window.addEventListener('dukaansaz:unauthorized', onUnauthorized);
    return () => window.removeEventListener('dukaansaz:unauthorized', onUnauthorized);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setStoredToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (details) => {
    const data = await registerUser(details);
    return data.user;
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, authenticated: Boolean(user) }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
