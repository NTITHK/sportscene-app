import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Shared logo (put logo at /assets/logo.jpg)
import AppLogo from '../../components/AppLogo';

// --- i18n strings ---
type Lang = 'zh-Hant' | 'zh-Hans' | 'en';
const STR = {
  'zh-Hant': {
    title: '會員登入',
    emailPH: '電郵',
    passwordPH: '密碼',
    login: '登入',
    register: '註冊',
    keepLogin: '保持登入',
    forgot: '忘記密碼？',
    // bottom-right buttons (shown when NOT current language)
    btnHans: '简体',
    btnEn: 'English',
    btnHantShort: '繁',
    btnHansShort: '简',
  },
  'zh-Hans': {
    title: '会员登录',
    emailPH: '电邮',
    passwordPH: '密码',
    login: '登录',
    register: '注册',
    keepLogin: '保持登录',
    forgot: '忘记密码？',
    btnHans: '简体',
    btnEn: 'English',
    btnHantShort: '繁',
    btnHansShort: '简',
  },
  en: {
    title: 'Member Login',
    emailPH: 'Email',
    passwordPH: 'Password',
    login: 'Log in',
    register: 'Register',
    keepLogin: 'Keep me signed in',
    forgot: 'Forgot password?',
    btnHans: '简体',
    btnEn: 'English',
    btnHantShort: '繁',
    btnHansShort: '简',
  },
} as const;

// Lightweight local checkbox (blue when active)
function Box({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={[styles.checkboxBox, value && styles.checkboxBoxActive]} hitSlop={8}>
      {value ? <Ionicons name="checkmark" size={16} color="#ffffff" /> : null}
    </Pressable>
  );
}

export default function Landing() {
  const [lang, setLang] = useState<Lang>('zh-Hant'); // default 繁體
  const T = STR[lang];

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);

  // dim placeholders that clear on focus / restore on blur (per current language)
  const [emailPH, setEmailPH] = useState<string>(T.emailPH);
  const [pwPH, setPwPH] = useState<string>(T.passwordPH);

  // Refresh placeholders on language change only if fields are empty
  useEffect(() => {
    if (!email) setEmailPH(STR[lang].emailPH);
    if (!pw) setPwPH(STR[lang].passwordPH);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const onLogin = () => {
    // TODO: call your signIn(email, pw, { keepLogin })
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Logo — fixed size 450 and centered */}
          <AppLogo style={styles.logo} />

          {/* Title */}
          <Text style={styles.title}>{T.title}</Text>

          {/* Email (no label, dim placeholder) */}
          <View style={styles.fieldWrap}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={emailPH}
              placeholderTextColor="#9aa3af"
              onFocus={() => setEmailPH('')}
              onBlur={() => setEmailPH(email ? '' : T.emailPH)}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          {/* Password with dim eye icon (inside field), no label */}
          <View style={styles.fieldWrap}>
            <View style={styles.pwdRow}>
              <TextInput
                style={[styles.input, styles.inputPwd]}
                value={pw}
                onChangeText={setPw}
                placeholder={pwPH}
                placeholderTextColor="#9aa3af"
                onFocus={() => setPwPH('')}
                onBlur={() => setPwPH(pw ? '' : T.passwordPH)}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <Pressable style={styles.eyeBtn} onPress={() => setShowPw(s => !s)} hitSlop={8}>
                <Ionicons name={showPw ? 'eye-off' : 'eye'} size={22} color="#9aa3af" />
              </Pressable>
            </View>
          </View>

          {/* Buttons */}
          <Pressable style={styles.loginBtn} onPress={onLogin}>
            <Text style={styles.loginTxt}>{T.login}</Text>
          </Pressable>

          <Pressable style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerTxt}>{T.register}</Text>
          </Pressable>

          {/* Keep Login + Forgot (below Register) */}
          <View style={styles.rowBetweenBelow}>
            <View style={styles.row}>
              <Box value={keepLogin} onChange={setKeepLogin} />
              <Text style={styles.keepTxt}>{T.keepLogin}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
              <Text style={styles.forgot}>{T.forgot}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom-right: show ONLY the other languages per current selection */}
          <View style={styles.langBottomRight}>
            {lang !== 'zh-Hant' && (
              <TouchableOpacity onPress={() => setLang('zh-Hant')}>
                {/* When current = 简体 → show "繁"; when current = English → show "繁" */}
                <Text style={styles.langLink}>{STR[lang].btnHantShort}</Text>
              </TouchableOpacity>
            )}
            {lang === 'zh-Hant' && (
              <TouchableOpacity onPress={() => setLang('zh-Hans')}>
                <Text style={[styles.langLink, { marginLeft: 0 }]}>{STR[lang].btnHans}</Text>
              </TouchableOpacity>
            )}
            {/* Show English if not already English */}
            {lang !== 'en' && (
              <TouchableOpacity onPress={() => setLang('en')}>
                <Text style={[styles.langLink, { marginLeft: 16 }]}>{STR[lang].btnEn}</Text>
              </TouchableOpacity>
            )}
            {/* Show 简 when in English */}
            {lang === 'en' && (
              <TouchableOpacity onPress={() => setLang('zh-Hans')}>
                <Text style={[styles.langLink, { marginLeft: 16 }]}>{STR[lang].btnHansShort}</Text>
              </TouchableOpacity>
            )}
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
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },

  // ✅ Fixed forever: 450 x 450
  logo: { width: 450, height: 450, marginTop: 12, marginBottom: 8 },

  title: { fontSize: 35, fontWeight: '700', color: BLUE_DARK, marginBottom: 10 },

  fieldWrap: { width: '100%', marginTop: 10 },

  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pwdRow: { position: 'relative', width: '100%' },
  inputPwd: { paddingRight: 44 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },

  rowBetweenBelow: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checkboxBoxActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  keepTxt: { fontSize: 14, color: '#111827' },
  forgot: { fontSize: 14, color: '#1f2937', textDecorationLine: 'underline' },

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
    backgroundColor: '#fff',
  },
  registerTxt: { color: BLUE, fontSize: 18, fontWeight: '700' },

  // Bottom-right language placement
  langBottomRight: {
    position: 'absolute',
    right: 22,
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  langLink: { color: BLUE_DARK, fontSize: 15, fontWeight: '600' },
});
