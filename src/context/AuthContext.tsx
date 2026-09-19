import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authLogin, authRegister, authLogout, getMe } from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = 'teachai_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authRegister(name, email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  };

  const logout = async () => {
    try { await authLogout(); } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
