import api, { endpoints } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';


interface User { email: string }
interface AuthContextValue {
user: User | null;
token: string | null;
isLoading: boolean;
signIn: (email: string, password: string) => Promise<void>;
signOut: () => Promise<void>;
register: (payload: { email: string; password: string; name?: string }) => Promise<void>;
requestPasswordReset: (email: string) => Promise<void>;
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
(async () => {
try {
const stored = await SecureStore.getItemAsync('auth');
if (stored) {
const parsed = JSON.parse(stored);
setUser(parsed.user); setToken(parsed.token);
}
} finally { setIsLoading(false); }
})();
}, []);


const signIn = async (email: string, password: string) => {
const res = await api.post(endpoints.login, { email, password });
const payload = res.data; // { token: string, user: { email: string } }
setUser(payload.user); setToken(payload.token);
await SecureStore.setItemAsync('auth', JSON.stringify(payload));
};


const signOut = async () => { setUser(null); setToken(null); await SecureStore.deleteItemAsync('auth'); };
const register = async (payload: { email: string; password: string; name?: string }) => { await api.post(endpoints.register, payload); };
const requestPasswordReset = async (email: string) => { await api.post(endpoints.forgot, { email }); };


const value = useMemo(() => ({ user, token, isLoading, signIn, signOut, register, requestPasswordReset }), [user, token, isLoading]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within AuthProvider');
return ctx;
};