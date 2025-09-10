import { useLocale } from '@/context/LocaleContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function LanguageSwitcher() {
const { locale, setLocale } = useLocale();
const opt = [
{ key: 'zh-Hant', label: '繁體' },
{ key: 'zh-Hans', label: '简体' },
{ key: 'en', label: 'EN' }
] as const;
return (
<View style={styles.row}>
{opt.map(o => (
<Pressable key={o.key} onPress={() => setLocale(o.key as any)} style={[styles.btn, locale === o.key && styles.btnActive]}>
<Text style={[styles.text, locale === o.key && styles.textActive]}>{o.label}</Text>
</Pressable>
))}
</View>
);
}
const styles = StyleSheet.create({
row: { flexDirection: 'row', gap: 8 },
btn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
btnActive: { borderColor: '#1d4ed8' },
text: { color: '#333' },
textActive: { color: '#1d4ed8', fontWeight: '700' }
});