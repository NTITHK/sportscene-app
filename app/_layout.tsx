// app/_layout.tsx
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';
import Constants from 'expo-constants';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';

function RootNavigator() {
  const { isLoading, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasRouted = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // extra safety: hide splash on first frame after auth restores
    SplashScreen.hideAsync().catch(() => {});

    const top = segments[0]; // '(public)', '(auth)', 'member_profile', etc.
    const inAuth = top === '(auth)';
    const inPublic = top === '(public)';

    if (hasRouted.current) return;

    if (!token) {
      if (!inAuth && !inPublic) {
        hasRouted.current = true;
        router.replace('/(public)/landing');
      }
      return;
    }

    // logged in
    if (inAuth || inPublic) {
      hasRouted.current = true;
      router.replace('/member_profile');
    }
  }, [isLoading, token, segments, router]);

  // 👉 Don’t render any route until auth is ready
  if (isLoading) return null;

  return (
    <Stack
      initialRouteName="(public)/landing"
      screenOptions={{
        headerShadowVisible: false,
        animation: 'none',
        contentStyle: { backgroundColor: '#fff' }, // no transparent flash
      }}
    >
      <Stack.Screen name="(public)/landing" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
      <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
      <Stack.Screen name="(auth)/forgot" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="member_profile" options={{ headerShown: false }} />
      <Stack.Screen name="members/index" options={{ title: 'Members' }} />
    </Stack>
  );
}

export default function Layout() {
  const defaultLocale =
    ((Constants.expoConfig?.extra || {}) as any).defaultLocale || 'zh-Hant';
  return (
    <LocaleProvider defaultLocale={defaultLocale}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </LocaleProvider>
  );
}
