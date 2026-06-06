import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kuvia_user');
    const savedToken = localStorage.getItem('kuvia_token');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('kuvia_user');
      }
    }

    if (savedToken) {
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login: (nextTokenOrPayload, nextUser) => {
      const payload = nextUser || nextTokenOrPayload;
      const authToken = nextUser ? nextTokenOrPayload : null;

      if (authToken) {
        setToken(authToken);
        localStorage.setItem('kuvia_token', authToken);
      }

      if (payload?.user) {
        setUser(payload.user);
        localStorage.setItem('kuvia_user', JSON.stringify(payload.user));
        return;
      }

      if (payload) {
        setUser(payload);
        localStorage.setItem('kuvia_user', JSON.stringify(payload));
      }
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('kuvia_user');
      localStorage.removeItem('kuvia_token');
    },
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
