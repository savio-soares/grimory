import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('grimory_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('grimory_token');
      if (token) {
        try {
          const user = await api.getMe() as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          api.logout();
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await api.login(email, password) as { user: User };
    setState({
      user,
      token: api.getToken(),
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    api.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = async (data: Partial<User>) => {
    const updatedUser = await api.updateUser({
      savings: data.savings,
      current_phase: data.current_phase,
      name: data.name ?? undefined,
    }) as User;
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
