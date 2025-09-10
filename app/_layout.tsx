import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';
import Constants from 'expo-constants';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';


function RootNavigator() {
const { isLoading, token } = useAuth();
const segments = useSegments();
const router = useRouter();


useEffect(() => {
if (isLoading) return;
const inAuth = segments[0] === '(auth)';
const inPublic = segments[0] === '(public)';
if (!token && !inAuth && !inPublic) router.replace('/(public)/landing');
if (token && (inAuth || inPublic)) router.replace('/');
}, [isLoading, token, segments, router]);


return (
<Stack screenOptions={{ headerShadowVisible: false }}>
<Stack.Screen name="(public)/landing" options={{ headerShown: false }} />
<Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
<Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
<Stack.Screen name="(auth)/forgot" options={{ title: 'Forgot Password' }} />
<Stack.Screen name="index" options={{ title: 'Home' }} />
<Stack.Screen name="members/index" options={{ title: 'Members' }} />
</Stack>
);
}


export default function Layout() {
const defaultLocale = ((Constants.expoConfig?.extra || {}) as any).defaultLocale || 'zh-Hant';
return (
<LocaleProvider defaultLocale={defaultLocale}>
<AuthProvider>
<RootNavigator />
</AuthProvider>
</LocaleProvider>
);
}