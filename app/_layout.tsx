// app/_layout.tsx
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';
import Constants from 'expo-constants';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';

function RootNavigator() {
  const { isLoading, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasRouted = useRef(false);

  useEffect(() => {
    if (isLoading) return; // wait until AuthProvider finished restoring

    const top = segments[0]; // e.g. '(public)', '(auth)', 'member_profile', 'index'
    const inAuth = top === '(auth)';
    const inPublic = top === '(public)';
    const onProfile = top === 'member_profile'; // file: app/member_profile.tsx

    // Avoid multiple replace() calls in a single pass
    if (hasRouted.current) return;

    if (!token) {
      // Not logged in → send to landing if not already in public/auth
      if (!inAuth && !inPublic) {
        hasRouted.current = true;
        router.replace('/(public)/landing');
      }
      return;
    }

    // Logged in:
    if (inAuth || inPublic) {
      hasRouted.current = true;
      router.replace('/member_profile');
      return;
    }

    // If already on member_profile or other private routes, do nothing
  }, [isLoading, token, segments, router]);

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="(public)/landing" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
      <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
      <Stack.Screen name="(auth)/forgot" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="member_profile" options={{ title: 'Profile' }} />
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
