import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>會員登入</Text>

        <Text style={styles.label}>電郵</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          style={styles.input}
        />

        <Text style={styles.label}>密碼</Text>
        <View style={styles.passwordRow}>
          <TextInput
            value={pw}
            onChangeText={setPw}
            placeholder="••••••••"
            secureTextEntry={!showPw}
            style={[styles.input, styles.inputPwd]}
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={22} color="#6b7280" />
          </Pressable>
        </View>

        <Pressable style={styles.loginBtn} onPress={() => router.replace('/home')}>
          <Text style={styles.loginTxt}>登入</Text>
        </Pressable>

        <Pressable style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerTxt}>註冊</Text>
        </Pressable>

        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Checkbox value={remember} onValueChange={setRemember} color="#1d4ed8" style={styles.checkbox} />
            <Text style={styles.rememberTxt}>保持登入</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
            <Text style={styles.forgot}>忘記密碼？</Text>
          </TouchableOpacity>
        </View>
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
  passwordRow: { position: 'relative' },
  inputPwd: { paddingRight: 44 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
  loginBtn: { backgroundColor: '#1d4ed8', borderRadius: 10, marginTop: 20, height: 48, alignItems: 'center', justifyContent: 'center' },
  loginTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerBtn: { borderColor: '#1d4ed8', borderWidth: 1.5, borderRadius: 10, marginTop: 10, height: 48, alignItems: 'center', justifyContent: 'center' },
  registerTxt: { color: '#1d4ed8', fontSize: 18, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { marginRight: 8 },
  rememberTxt: { fontSize: 14 },
  forgot: { fontSize: 14, textDecorationLine: 'underline' },
});
