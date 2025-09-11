// app/member_profile.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppLogo from '../components/AppLogo';
import { getSession } from '../lib/session';

// app/member_profile.tsx (inside the component render)
import { router } from 'expo-router';
import { clearSession } from '../lib/session';

// Add near the title:
<TouchableOpacity
  onPress={async () => { await clearSession(); router.replace('/(public)/landing'); }}
  style={{ position: 'absolute', right: 24, top: 24 }}
>
  <Text style={{ color: '#1d4ed8', fontWeight: '700' }}>Logout</Text>
</TouchableOpacity>

const BLUE_DARK = '#0b4aa2';
const BORDER = '#e5e7eb';

const STR = {
  'zh-Hant': {
    title: '會員資料',
    parentEmail: '家長電郵',
    tokens: '登入權杖',
    access: '存取權杖',
    refresh: '更新權杖',
    children: '子女',
    id: '編號',
    name: '姓名',
    dob: '出生日期',
    missing: '沒有資料可顯示。',
  },
  'zh-Hans': {
    title: '会员资料',
    parentEmail: '家长电邮',
    tokens: '登录令牌',
    access: '访问令牌',
    refresh: '刷新令牌',
    children: '子女',
    id: '编号',
    name: '姓名',
    dob: '出生日期',
    missing: '没有资料可显示。',
  },
  en: {
    title: 'Member Profile',
    parentEmail: 'Parent Email',
    tokens: 'Tokens',
    access: 'Access Token',
    refresh: 'Refresh Token',
    children: 'Children',
    id: 'ID',
    name: 'Name',
    dob: 'Date of Birth',
    missing: 'No data to display.',
  },
} as const;

export default function MemberProfile() {
  const [lang, setLang] = useState<'zh-Hant' | 'zh-Hans' | 'en'>('zh-Hant');
  const [p, setP] = useState<Awaited<ReturnType<typeof getSession>>>(null);

  useEffect(() => {
    (async () => {
      const sess = await getSession();
      setP(sess);
      if (sess?.lang) setLang(sess.lang);
    })();
  }, []);

  const T = STR[lang];

  const mask = (s?: string, show = 8) =>
    !s ? '' : (s.length <= show ? s : `${s.slice(0, show)}… (${s.length} chars)`);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppLogo style={styles.logo} />
        <Text style={styles.title}>{T.title}</Text>

        {!p ? (
          <Text style={styles.missing}>{T.missing}</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{T.parentEmail}</Text>
              <Text style={styles.value}>{p.parent?.email || '-'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{T.tokens}</Text>
              <Text style={styles.label}>{T.access}</Text>
              <Text style={styles.mono}>{mask(p.access_token)}</Text>
              {p.refresh_token ? (
                <>
                  <Text style={[styles.label, { marginTop: 8 }]}>{T.refresh}</Text>
                  <Text style={styles.mono}>{mask(p.refresh_token)}</Text>
                </>
              ) : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{T.children}</Text>
              {!p.children?.length ? (
                <Text style={styles.value}>-</Text>
              ) : (
                <FlatList
                  data={p.children}
                  keyExtractor={(c) => String(c.id)}
                  ItemSeparatorComponent={() => <View style={styles.sep} />}
                  renderItem={({ item }) => (
                    <View style={styles.rowBetween}>
                      <Text style={styles.childLeft}>
                        {T.id}: {item.id}   {T.name}: {item.name}
                      </Text>
                      <Text style={styles.childRight}>
                        {T.dob}: {item.dob}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  logo: { width: 160, height: 160, marginTop: 12, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: BLUE_DARK, marginBottom: 12, alignSelf: 'flex-start' },

  card: { width: '100%', borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 14, marginTop: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#111827' },
  label: { fontSize: 13, color: '#6b7280' },
  value: { fontSize: 15, color: '#111827' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }), fontSize: 12, color: '#111827' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  childLeft: { fontSize: 14, color: '#111827' },
  childRight: { fontSize: 14, color: '#374151' },

  sep: { height: 1, backgroundColor: BORDER, marginVertical: 8 },
  missing: { marginTop: 8, color: '#6b7280', alignSelf: 'flex-start' },
});
