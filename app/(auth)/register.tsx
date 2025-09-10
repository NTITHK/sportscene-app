import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>註冊</Text>

        <Text style={styles.label}>電郵</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="example@email.com" style={styles.input} />

        <Text style={styles.label}>密碼</Text>
        <TextInput value={pw} onChangeText={setPw} placeholder="至少8字元" secureTextEntry style={styles.input} />

        <Text style={styles.label}>確認密碼</Text>
        <TextInput value={confirm} onChangeText={setConfirm} placeholder="再次輸入密碼" secureTextEntry style={styles.input} />

        <Pressable style={styles.loginBtn} onPress={() => router.replace('/home')}>
          <Text style={styles.loginTxt}>建立帳戶</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#0b4aa2', marginBottom: 20 },
  label: { fontSize: 14, color: '#111', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 14, height: 46 },
  loginBtn: { backgroundColor: '#1d4ed8', borderRadius: 10, marginTop: 20, height: 48, alignItems: 'center', justifyContent: 'center' },
  loginTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
