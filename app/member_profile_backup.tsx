import { getSession } from '@/lib/session';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Image,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type Child = { id: number; name: string; e_name?: string; dob?: string };
type Lang = 'zh-Hant' | 'zh-Hans' | 'en';

const BLUE = '#1561AF';
const BLUE_LIGHT = '#1d69d8';
const BLUE_BG = '#e6eefc';
const SCREEN_BG = '#f2f6fb';
const CARD_BG = '#ffffff';
const BORDER = '#e5e7eb';

const STR = {
  'zh-Hant': { notices: '通告', bills: '賬單', classes: '課堂日期', chooseStudent: '選擇學生', han: '繁', hans: '简', en: 'English', qr: 'QR 碼' },
  'zh-Hans': { notices: '通告', bills: '账单', classes: '课堂日期', chooseStudent: '选择学生', han: '繁', hans: '简', en: 'English', qr: '二维码' },
  en:        { notices: 'Notices', bills: 'Bills', classes: 'Class Dates', chooseStudent: 'Choose student', han: '繁', hans: '简', en: 'English', qr: 'QR Code' },
} as const;

export default function MemberProfile() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('zh-Hant');
  const T = STR[lang];

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false); // ← QR modal

  const student = useMemo(() => children[selectedIndex], [children, selectedIndex]);
  const hasMultiple = children.length > 1;

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        const kids: Child[] = Array.isArray(session?.children) ? session.children : [];
        setChildren(kids);
      } catch {
        Alert.alert(lang === 'en' ? 'Failed to load profile' : '無法載入會員資料');
      }
    })();
  }, [lang]);

  const openStudentPicker = () => {
    if (!hasMultiple) return;
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: T.chooseStudent,
          options: [...children.map(c => c.name || `#${c.id}`), '取消'],
          cancelButtonIndex: children.length,
        },
        idx => { if (idx !== undefined && idx >= 0 && idx < children.length) setSelectedIndex(idx); }
      );
    } else {
      setPickerOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header banner flush to top */}
        <View style={styles.headerWrap}>
          <Image
            source={require('../assets/images/member_header.png')}
            style={styles.headerImg}
            resizeMode="cover"
          />
        </View>

        {/* Student name row below banner */}
        <View style={styles.studentRow}>
          <Pressable
            style={[styles.nameBadge, !hasMultiple && { paddingRight: 12 }]}
            onPress={openStudentPicker}
            disabled={!hasMultiple}
          >
            <Text style={styles.nameText} numberOfLines={1}>
              {student?.name || '—'}
            </Text>
            {hasMultiple && <Ionicons name="chevron-down" size={16} color="#1e3a8a" />}
          </Pressable>
        </View>

        {/* Sections */}
        <View style={styles.sections}>
          <SectionCard title={T.notices} icon="megaphone-outline" onPress={() => router.push('/notices')} />
          <SectionCard title={T.bills}   icon="receipt-outline"  onPress={() => router.push('/invoices')} />
          <SectionCard title={T.classes} icon="calendar-outline" onPress={() => router.push('/classes')}>
            <CalendarStub />
          </SectionCard>
        </View>
      </ScrollView>

      {/* Bottom bar with QR between bell and user */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn}><Ionicons name="menu" size={26} color="#fff" /></TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}><Ionicons name="notifications-outline" size={26} color="#fff" /></TouchableOpacity>

        {/* NEW: QR icon */}
        <TouchableOpacity style={styles.bottomBtn} onPress={() => setQrOpen(true)}>
          <Ionicons name="qr-code-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn}><Ionicons name="person-circle-outline" size={26} color="#fff" /></TouchableOpacity>
      </View>

      {/* QR Modal: member_id={student.id} + e_name label */}
      <Modal visible={qrOpen} transparent animationType="fade" onRequestClose={() => setQrOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setQrOpen(false)}>
          <View style={styles.qrBox}>
            {student?.id ? (
              <>
                <QRCode value={`member_id=${student.id}`} size={220} />
                <Text style={styles.qrLabel}>{student?.e_name || ''}</Text>
              </>
            ) : (
              <Text style={styles.qrLabel}>{T.qr}</Text>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Android student picker */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalSheet}>
            {children.map((c, idx) => (
              <TouchableOpacity key={c.id} style={styles.modalRow} onPress={() => { setSelectedIndex(idx); setPickerOpen(false); }}>
                <Text style={styles.modalRowText}>{c.name || `#${c.id}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Language links */}
      <View style={styles.langBottomRight}>
        {lang !== 'zh-Hant' && (<TouchableOpacity onPress={() => setLang('zh-Hant')}><Text style={styles.langLink}>{T.han}</Text></TouchableOpacity>)}
        {lang !== 'zh-Hans' && (<TouchableOpacity style={{ marginLeft: 14 }} onPress={() => setLang('zh-Hans')}><Text style={styles.langLink}>{T.hans}</Text></TouchableOpacity>)}
        {lang !== 'en' && (<TouchableOpacity style={{ marginLeft: 14 }} onPress={() => setLang('en')}><Text style={styles.langLink}>{T.en}</Text></TouchableOpacity>)}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Cards & Calendar ---------- */

function SectionCard({
  icon, title, children, onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.cardIconCircle}><Ionicons name={icon} size={20} color={BLUE} /></View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.arrowCircle}><Ionicons name="chevron-forward" size={18} color="#fff" /></View>
      </View>
      {children ? <View style={styles.cardBody}>{children}</View> : null}
    </Pressable>
  );
}

function CalendarStub() {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const grid: (string | number)[] = [...Array(6).fill(''), 1,2,3,4,5,6,7, 8,9,10,11,12,13,14, 15,16,17,18,19,20,21, 22,23,24,25,26,27,28, 29,30,31];
  return (
    <View>
      <View style={styles.calendarWeekRow}>
        {days.map(d => <Text key={d} style={styles.calendarWeekDay}>{d}</Text>)}
      </View>
      <View style={styles.calendarGrid}>
        {grid.map((d, i) => (
          <View key={i} style={styles.calendarCell}>
            <Text style={styles.calendarDayText}>{String(d || '')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BLUE },
  scroll: { paddingBottom: 90 },

  headerWrap: { width: '100%', backgroundColor: BLUE },
  headerImg:  { width: '100%', height: 94 },

  studentRow: {
    backgroundColor: BLUE,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  nameBadge: {
    backgroundColor: BLUE_BG,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '80%',
  },
  nameText: { color: BLUE, fontWeight: '700' },

  sections: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader:   { paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIconCircle:{ width: 34, height: 34, borderRadius: 17, backgroundColor: BLUE_BG, alignItems: 'center', justifyContent: 'center' },
  cardTitle:    { fontSize: 20, color: BLUE, fontWeight: '800' },
  arrowCircle:  { width: 28, height: 28, borderRadius: 14, backgroundColor: BLUE_LIGHT, alignItems: 'center', justifyContent: 'center' },
  cardBody:     { paddingTop: 10 },

  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, marginBottom: 6 },
  calendarWeekDay: { width: `${100 / 7}%`, textAlign: 'center', color: '#6b7280', fontWeight: '600' },
  calendarGrid:    { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: StyleSheet.hairlineWidth, borderLeftWidth: StyleSheet.hairlineWidth, borderColor: BORDER },
  calendarCell:    { width: `${100 / 7}%`, aspectRatio: 1, borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  calendarDayText: { color: '#111827' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, backgroundColor: BLUE, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 8, paddingTop: 8 },
  bottomBtn: { padding: 8 },

  langBottomRight: { position: 'absolute', right: 14, bottom: 70, flexDirection: 'row', alignItems: 'center' },
  langLink:        { color: BLUE, fontSize: 14, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  modalSheet:    { backgroundColor: '#fff', borderRadius: 12, minWidth: 260, paddingVertical: 4, overflow: 'hidden' },
  modalRow:      { paddingHorizontal: 16, paddingVertical: 12 },
  modalRowText:  { fontSize: 16, color: '#111827' },

  qrBox:   { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  qrLabel: { marginTop: 12, fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#111827' },
});
