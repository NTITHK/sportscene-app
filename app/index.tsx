// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import AppLogo from '../components/AppLogo';

// ---- Simple built-in i18n (default 繁) ----
type Lang = 'zh-Hant' | 'zh-Hans' | 'en';
const STR = {
  'zh-Hant': {
    title: '會員登入',
    email: '電郵',
    password: '密碼',
    login: '登入',
    register: '註冊',
    remember: '保持登入',
    forgot: '忘記密碼？',
    lang_simplified: '简体',
    lang_english: 'English',
    placeholder_email: 'example@email.com',
    placeholder_password: '••••••••',
  },
  'zh-Hans': {
    title: '会员登录',
    email: '电邮',
    password: '密码',
    login: '登录',
    register: '注册',
    remember: '保持登录',
    forgot: '忘记密码？',
    lang_simplified: '简体',
    lang_english: 'English',
    placeholder_email: 'example@email.com',
    placeholder_password: '••••••••',
  },
  en: {
    title: 'Member Login',
    email: 'Email',
    password: 'Password',
    login: 'Log in',
    register: 'Register',
    remember: 'Keep me signed in',
    forgot: 'Forgot password?',
    lang_simplified: '简体',
    lang_english: 'English',
    placeholder_email: 'example@email.com',
    placeholder_password: '••••••••',
  },
};

export default function Landing() {
  const [lang, setLang] = useState<Lang>('zh-Hant'); // default 繁
  const t = STR[lang];

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);

  const onLogin = () => {
    // TODO: integrate with your AuthContext / API
    // e.g. await signIn(email, pw, { remember });
    router.replace('/home'); // temp navigation
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.wrap}
      >
        <View style={styles.container}>
          {/* Logo */}
          <AppLogo style={styles.logo} />
          

          {/* Title */}
          <Text style={styles.title}>{t.title}</Text>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>{t.email}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t.placeholder_email}
              placeholderTextColor="#9aa3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>{t.password}</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={pw}
                onChangeText={setPw}
                placeholder={t.placeholder_password}
                placeholderTextColor="#9aa3af"
                secureTextEntry={!showPw}
                autoCapitalize="none"
                style={[styles.input, styles.inputPwd]}
              />
              <Pressable
                onPress={() => setShowPw(s => !s)}
                style={styles.eyeBtn}
                hitSlop={8}
              >
                <Ionicons name={showPw ? 'eye-off' : 'eye'} size={22} color="#6b7280" />
              </Pressable>
            </View>
          </View>

          {/* Login */}
          <Pressable style={styles.loginBtn} onPress={onLogin}>
            <Text style={styles.loginTxt}>{t.login}</Text>
          </Pressable>

          {/* Register (outline) */}
          <Pressable
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerTxt}>{t.register}</Text>
          </Pressable>

          {/* Remember + Forgot */}
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? '#1d4ed8' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.rememberTxt}>{t.remember}</Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
              <Text style={styles.forgot}>{t.forgot}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom lang switch */}
          <View style={styles.langBar}>
            <TouchableOpacity onPress={() => setLang('zh-Hans')}>
              <Text style={styles.langLink}>{t.lang_simplified}</Text>
            </TouchableOpacity>
            <Text style={styles.langDivider}> | </Text>
            <TouchableOpacity onPress={() => setLang('en')}>
              <Text style={styles.langLink}>{t.lang_english}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BLUE = '#1d4ed8';
const BLUE_DARK = '#0b4aa2';
const BORDER = '#d1d5db';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  wrap: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logo: {
    width: 220,
    height: 140,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    color: BLUE_DARK,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16,
  },
  fieldWrap: { width: '100%', marginTop: 10 },
  label: { fontSize: 14, color: '#1f2937', marginBottom: 6, fontWeight: '600' },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  passwordRow: { position: 'relative', width: '100%' },
  inputPwd: { paddingRight: 44 },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    height: 22,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    width: '100%',
    height: 48,
    backgroundColor: BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerBtn: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
  registerTxt: { color: BLUE, fontSize: 18, fontWeight: '700' },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { marginRight: 8, borderRadius: 4 },
  rememberTxt: { color: '#111827', fontSize: 14 },
  forgot: { color: '#1f2937', fontSize: 14, textDecorationLine: 'underline' },
  langBar: {
    position: 'absolute',
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  langLink: {
    color: BLUE_DARK,
    fontSize: 15,
    fontWeight: '600',
  },
  langDivider: { color: '#9ca3af', marginHorizontal: 10 },
});
