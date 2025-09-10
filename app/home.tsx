import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/AppLogo';


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo header */}
        <AppLogo style={styles.logo} />
        {/* Title */}
        <Text style={styles.title}>主頁</Text>
        <Text style={styles.subtitle}>歡迎使用 Sportscene 會員系統</Text>

        {/* Primary CTA */}
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/members')}>
          <Text style={styles.primaryTxt}>查看成員</Text>
        </Pressable>

        {/* Secondary (Logout) */}
        <Pressable style={styles.secondaryBtn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.secondaryTxt}>登出</Text>
        </Pressable>

        {/* Bottom language switch (optional) */}
        <View style={styles.langBar}>
          <Text style={styles.langLink}>简体</Text>
          <Text style={styles.langDivider}> | </Text>
          <Text style={styles.langLink}>English</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#1d4ed8';
const BLUE_DARK = '#0b4aa2';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 10 },
  logo: { width: 220, height: 140, marginTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: BLUE_DARK, marginTop: 8 },
  subtitle: { fontSize: 14, color: '#4b5563', marginTop: 6, marginBottom: 20 },
  primaryBtn: {
    width: '100%', height: 48, backgroundColor: BLUE, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  primaryTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  secondaryBtn: {
    width: '100%', height: 48, borderRadius: 10, borderWidth: 1.5, borderColor: BLUE,
    alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#fff',
  },
  secondaryTxt: { color: BLUE, fontSize: 18, fontWeight: '700' },
  langBar: { position: 'absolute', bottom: 22, flexDirection: 'row', alignItems: 'center' },
  langLink: { color: BLUE_DARK, fontSize: 15, fontWeight: '600' },
  langDivider: { color: '#9ca3af', marginHorizontal: 10 },
});
