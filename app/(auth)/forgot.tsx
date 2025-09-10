import FormTextInput from '@/components/FormTextInput';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/i18n';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Forgot() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      Alert.alert(t('forgot.title'), t('forgot.send'));
    } catch (e: any) {
      Alert.alert(t('forgot.title'), e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forgot.title')}</Text>
      <FormTextInput label={t('login.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <Pressable onPress={onSubmit} style={[styles.btn, loading && { opacity: 0.7 }]} disabled={loading}>
        <Text style={styles.btnText}>{loading ? '…' : t('forgot.send')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  btn: { backgroundColor: '#1d4ed8', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
