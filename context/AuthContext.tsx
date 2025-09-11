// context/AuthContext.tsx
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// If you use these API helpers elsewhere, keep them; they are not used in the boot restore path.
import api, { endpoints } from '@/lib/api';

type User = { email: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setToken: (t: string | null) => Promise<void>;
  setUser: (u: User | null) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
};

const STORE_KEY = 'auth';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [token, _setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth on boot (runs AFTER first render; doesn't suspend)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORE_KEY);
        if (!mounted) return;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token) _setToken(parsed.token);
          if (parsed?.user) _setUser(parsed.user);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // persist helpers
  const persist = async (next: { token: string | null; user: User | null }) => {
    if (!next.token && !next.user) {
      await SecureStore.deleteItemAsync(STORE_KEY);
    } else {
      await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(next));
    }
  };

  const setToken = async (t: string | null) => {
    _setToken(t);
    await persist({ token: t, user });
  };

  const setUser = async (u: User | null) => {
    _setUser(u);
    await persist({ token, user: u });
  };

  // Optional API helpers (not used by the guard)
  const signIn = async (email: string, password: string) => {
    const res = await api.post(endpoints.login, { email, password });
    const data = res?.data ?? {};
    let nextToken: string | null = data.token ?? data.access_token ?? null;
    let nextUser: User | null =
      data.user ?? (data.parent?.email ? { email: data.parent.email } : null);

    _setToken(nextToken);
    _setUser(nextUser);
    await persist({ token: nextToken, user: nextUser });
  };

  const signOut = async () => {
    _setToken(null);
    _setUser(null);
    await SecureStore.deleteItemAsync(STORE_KEY);
  };

  const register = async (payload: { email: string; password: string; name?: string }) => {
    await api.post(endpoints.register, payload);
  };

  const requestPasswordReset = async (email: string) => {
    await api.post(endpoints.forgot, { email });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      setToken,
      setUser,
      signIn,
      signOut,
      register,
      requestPasswordReset,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
