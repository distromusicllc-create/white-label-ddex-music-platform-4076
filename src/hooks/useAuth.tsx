import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import auth from '@/lib/shared/kliv-auth.js';

interface User {
  userUuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  teamUuid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const u = await auth.getUser();
    setUser(u);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const signIn = async (email: string, password: string) => {
    await auth.signIn(email, password);
    await refresh();
  };

  const signUp = async (email: string, password: string, name?: string) => {
    await auth.signUp(email, password, name);
    await refresh();
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
