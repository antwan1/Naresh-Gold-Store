import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '../types';
import { getProfile, login as apiLogin, register as apiRegister } from '../services/api';

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if we have a stored token, try to hydrate user from profile
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    getProfile()
      .then((profile) => {
        setUser({ email: profile.email, first_name: profile.first_name, last_name: profile.last_name });
      })
      .catch(() => {
        // Token invalid/expired — clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    const tokens = await apiLogin(email, password);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    const profile = await getProfile();
    setUser({ email: profile.email, first_name: profile.first_name, last_name: profile.last_name });
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }

  async function register(data: RegisterData) {
    const result = await apiRegister(data);
    localStorage.setItem('access_token', result.access);
    localStorage.setItem('refresh_token', result.refresh);
    // Hydrate user from returned user object or profile
    if (result.user) {
      setUser(result.user);
    } else {
      const profile = await getProfile();
      setUser({ email: profile.email, first_name: profile.first_name, last_name: profile.last_name });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
