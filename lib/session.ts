// lib/session.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Child = { id: number; name: string; dob: string };
export type LoginPayload = {
  access_token: string;
  refresh_token?: string;
  parent?: { email?: string };
  children?: Child[];
  lang?: 'zh-Hant' | 'zh-Hans' | 'en';
};

const KEY = 'session_payload_v1';

// Save
export async function setSession(payload: LoginPayload) {
  await AsyncStorage.setItem(KEY, JSON.stringify(payload));
}

// Load
export async function getSession(): Promise<LoginPayload | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Clear
export async function clearSession() {
  await AsyncStorage.removeItem(KEY);
}
