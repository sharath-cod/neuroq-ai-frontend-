// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('nq_user')); } catch { return null; }});
  const [token, setToken] = useState(() => localStorage.getItem('nq_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('nq_token', res.data.token);
      localStorage.setItem('nq_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Login failed' };
    } finally { setLoading(false); }
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    setUser(null); setToken(null);
    localStorage.removeItem('nq_token');
    localStorage.removeItem('nq_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
