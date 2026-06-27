import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '../components/Card';
import Chip from '../components/Chip';
import { colors, font, radius, spacing } from '../theme';
import { profile } from '../data/profile';
import { jobPlatforms } from '../data/platforms';
import { getRegionById } from '../data/regions';
import { getEducationLevel } from '../data/education';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface Row {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  warn?: boolean;
  badge?: string;
  trailing?: string;
  onPress?: () => void;
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, connectedPlatformIds, signOut } = useAuth();
  const { L, isRTL, lang, toggle } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';
  const ta = isRTL ? 'right' : 'left';

  const region = getRegionById(user?.regionId);
  const edu = getEducationLevel(user?.educationLevelId);
  const roleLine = [user?.specialization, edu ? L(edu.ar, edu.en) : undefined, region?.name]
    .filter(Boolean)
    .join(' · ');

  const infoRows: Row[] = [
    { icon: 'document-text-outline', title: L('السيرة الذاتية', 'Resume'), value: profile.resumeFile, onPress: () => navigation.navigate('ResumeAnalyzer') },
    {
      icon: 'git-network-outline',
      title: L('المنصات المرتبطة', 'Linked platforms'),
      value: `${connectedPlatformIds.length} / ${jobPlatforms.length}`,
      onPress: () => navigation.navigate('ConnectPlatforms'),
    },
    { icon: 'school-outline', title: L('المؤهل العلمي', 'Education level'), value: edu ? L(edu.ar, edu.en) : L('غير محدد', 'Not set') },
    { icon: 'ribbon-outline', title: L('التخصص', 'Field of study'), value: user?.specialization || L('غير محدد', 'Not set') },
    { icon: 'location-outline', title: L('المنطقة', 'Region'), value: region?.name || L('غير محددة', 'Not set') },
    { icon: 'mail-outline', title: L('البريد الإلكتروني', 'Email'), value: user?.email },
  ];

  const settings: Row[] = [
    { icon: 'notifications-outline', title: L('الإشعارات', 'Notifications') },
    { icon: 'eye-outline', title: L('الخصوصية والظهور', 'Privacy & visibility') },
    { icon: 'star-outline', title: L('الاشتراك', 'Subscription'), badge: L('بريميوم', 'Premium') },
    { icon: 'globe-outline', title: L('اللغة', 'Language'), trailing: lang === 'ar' ? 'العربية ⇄ English' : 'English ⇄ العربية', onPress: toggle },
    { icon: 'help-circle-outline', title: L('المساعدة والدعم', 'Help & support') },
  ];

  const renderRow = (r: Row, i: number, len: number) => (
    <TouchableOpacity
      key={r.title}
      style={[styles.row, { flexDirection: row }, i < len - 1 && styles.rowBorder]}
      activeOpacity={r.onPress ? 0.7 : 1}
      onPress={r.onPress}
    >
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={colors.textFaint} />
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { textAlign: ta }]}>{r.title}</Text>
        {r.value ? (
          <Text style={[styles.rowValue, { textAlign: ta }, r.warn && { color: colors.danger }]} numberOfLines={1}>
            {r.value}
          </Text>
        ) : null}
      </View>
      {r.badge ? (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>{r.badge}</Text>
        </View>
      ) : r.trailing ? (
        <Text style={styles.trailing}>{r.trailing}</Text>
      ) : null}
      <Ionicons name={r.icon} size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.hero}>
          <View style={styles.avatarBig}>
            <Ionicons name="person" size={34} color={colors.white} />
          </View>
          <Text style={styles.name}>{user?.name ?? L('مستخدم', 'User')}</Text>
          <Text style={styles.role}>{roleLine || L('أكمل ملفك الشخصي', 'Complete your profile')}</Text>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
            <Text style={styles.editText}>{L('تحرير الملف', 'Edit profile')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={[styles.scoreRow, { flexDirection: row }]}>
            <TouchableOpacity style={styles.scoreBox} onPress={() => navigation.navigate('Ats')} activeOpacity={0.85}>
              <Text style={styles.scoreValue}>{profile.atsScore}</Text>
              <Text style={styles.scoreLabel}>{L('توافق ATS', 'ATS score')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scoreBox} onPress={() => navigation.navigate('ResumeAnalyzer')} activeOpacity={0.85}>
              <Text style={styles.scoreValue}>{profile.resumeScore}</Text>
              <Text style={styles.scoreLabel}>{L('نقاط السيرة الذاتية', 'Resume score')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('معلومات الملف', 'Profile information')}</Text>
          <Card flat style={styles.listCard}>{infoRows.map((r, i) => renderRow(r, i, infoRows.length))}</Card>

          <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('المهارات', 'Skills')}</Text>
          <Card flat style={styles.listCard}>
            <View style={[styles.skillsWrap, { flexDirection: row }]}>
              {profile.skills.map((s) => (
                <Chip key={s} label={s} variant="outline" />
              ))}
            </View>
          </Card>

          <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('الإعدادات', 'Settings')}</Text>
          <Card flat style={styles.listCard}>{settings.map((r, i) => renderRow(r, i, settings.length))}</Card>

          <TouchableOpacity style={styles.logout} activeOpacity={0.85} onPress={signOut}>
            <Text style={styles.logoutText}>{L('تسجيل الخروج', 'Sign out')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.primary, alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  avatarBig: { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  name: { fontSize: font.h2, fontWeight: '800', color: colors.white, marginTop: spacing.md },
  role: { fontSize: font.small, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'center', paddingHorizontal: spacing.lg },
  editBtn: { marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.xl, paddingVertical: 8 },
  editText: { color: colors.white, fontWeight: '700', fontSize: font.small },

  body: { paddingHorizontal: spacing.lg },
  scoreRow: { gap: spacing.md, marginTop: -spacing.lg },
  scoreBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  scoreValue: { fontSize: font.h1, fontWeight: '800', color: colors.primary },
  scoreLabel: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  listCard: { paddingVertical: 0, paddingHorizontal: spacing.lg },
  row: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowText: { flex: 1 },
  rowTitle: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  rowValue: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  trailing: { fontSize: font.small, color: colors.primary, fontWeight: '700' },
  premiumBadge: { backgroundColor: colors.goldSoft, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 3 },
  premiumText: { color: colors.gold, fontSize: font.tiny, fontWeight: '800' },

  skillsWrap: { flexWrap: 'wrap', gap: 8, paddingVertical: spacing.lg },

  logout: { backgroundColor: colors.dangerBg, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: spacing.xl },
  logoutText: { color: colors.danger, fontWeight: '800', fontSize: font.body },
});
