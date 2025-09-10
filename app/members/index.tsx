import { useAuth } from '@/context/AuthContext';
import { t } from '@/i18n';
import api, { endpoints } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

interface Member { id: string | number; name: string; className?: string; status?: string }

export default function MembersList() {
  const { user, token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.members, {
          headers: { Authorization: `Bearer ${token}` },
          params: { email: user?.email }
        });
        setMembers(res.data?.members || []);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 404) Alert.alert(t('members.title'), t('errors.notFound'));
        else Alert.alert(t('members.title'), e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user?.email]);

  if (loading) return (<View style={styles.center}><ActivityIndicator /></View>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('members.title')}</Text>
      <FlatList
        data={members}
        keyExtractor={(m) => String(m.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            {item.className ? <Text style={styles.meta}>{item.className}</Text> : null}
            <Text style={[styles.badge, item.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid]}>
              {item.status || 'Unpaid'}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { paddingVertical: 12 },
  sep: { height: 1, backgroundColor: '#eee' },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 2 },
  badge: { alignSelf: 'flex-start', marginTop: 6, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, overflow: 'hidden', color: '#fff' },
  badgePaid: { backgroundColor: '#16a34a' },
  badgeUnpaid: { backgroundColor: '#ef4444' }
});
