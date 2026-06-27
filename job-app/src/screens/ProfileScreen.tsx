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
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface InfoRow {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  warn?: boolean;
  onPress?: () => void;
}

interface SettingRow {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  trailing?: string;
  badge?: string;
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, connectedPlatformIds, signOut } = useAuth();

  const infoRows: InfoRow[] = [
    { icon: 'document-text-outline', title: 'السيرة الذاتية', value: profile.resumeFile, onPress: () => navigation.navigate('ResumeAnalyzer') },
    {
      icon: 'git-network-outline',
      title: 'المنصات المرتبطة',
      value: `${connectedPlatformIds.length} من ${jobPlatforms.length} منصة`,
      onPress: () => navigation.navigate('ConnectPlatforms'),
    },
    { icon: 'school-outline', title: 'التعليم', value: profile.education },
    { icon: 'briefcase-outline', title: 'الخبرة', value: profile.experience },
    { icon: 'link-outline', title: 'رابط معرض الأعمال', value: profile.portfolioLinked ? 'مُضاف' : 'لم يُضف — اضغط للإضافة', warn: !profile.portfolioLinked },
  ];

  const settings: SettingRow[] = [
    { icon: 'notifications-outline', title: 'الإشعارات' },
    { icon: 'eye-outline', title: 'الخصوصية والظهور' },
    { icon: 'star-outline', title: 'الاشتراك', badge: 'بريميوم' },
    { icon: 'globe-outline', title: 'اللغة', trailing: 'العربية' },
    { icon: 'help-circle-outline', title: 'المساعدة والدعم' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {/* Header */}
        <View style={styles.hero}>
          <View style={styles.avatarBig}>
            <Ionicons name="person" size={34} color={colors.white} />
          </View>
          <Text style={styles.name}>{user?.name ?? profile.name}</Text>
          <Text style={styles.role}>{profile.title} · {profile.location}</Text>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
            <Text style={styles.editText}>تحرير الملف</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Scores */}
          <View style={styles.scoreRow}>
            <TouchableOpacity style={styles.scoreBox} onPress={() => navigation.navigate('Ats')} activeOpacity={0.85}>
              <Text style={styles.scoreValue}>{profile.atsScore}</Text>
              <Text style={styles.scoreLabel}>توافق ATS</Text>
              <Ionicons name="chevron-back" size={14} color={colors.textMuted} style={styles.scoreArrow} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.scoreBox} onPress={() => navigation.navigate('ResumeAnalyzer')} activeOpacity={0.85}>
              <Text style={styles.scoreValue}>{profile.resumeScore}</Text>
              <Text style={styles.scoreLabel}>نقاط السيرة الذاتية</Text>
              <Ionicons name="chevron-back" size={14} color={colors.textMuted} style={styles.scoreArrow} />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <Text style={styles.sectionTitle}>معلومات الملف</Text>
          <Card flat style={styles.listCard}>
            {infoRows.map((row, i) => (
              <TouchableOpacity
                key={row.title}
                style={[styles.row, i < infoRows.length - 1 && styles.rowBorder]}
                activeOpacity={row.onPress ? 0.7 : 1}
                onPress={row.onPress}
              >
                <Ionicons name="chevron-back" size={16} color={colors.textFaint} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={[styles.rowValue, row.warn && { color: colors.danger }]} numberOfLines={1}>
                    {row.value}
                  </Text>
                </View>
                <Ionicons name={row.icon} size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </Card>

          {/* Skills */}
          <Text style={styles.sectionTitle}>المهارات</Text>
          <Card flat style={styles.listCard}>
            <View style={styles.skillsWrap}>
              {profile.skills.map((s) => (
                <Chip key={s} label={s} variant="outline" />
              ))}
            </View>
          </Card>

          {/* Settings */}
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          <Card flat style={styles.listCard}>
            {settings.map((row, i) => (
              <TouchableOpacity
                key={row.title}
                style={[styles.row, i < settings.length - 1 && styles.rowBorder]}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={16} color={colors.textFaint} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                </View>
                {row.badge ? (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>{row.badge}</Text>
                  </View>
                ) : row.trailing ? (
                  <Text style={styles.trailing}>{row.trailing}</Text>
                ) : null}
                <Ionicons name={row.icon} size={20} color={colors.text} />
              </TouchableOpacity>
            ))}
          </Card>

          <TouchableOpacity style={styles.logout} activeOpacity={0.85} onPress={signOut}>
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
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
  name: { fontSize: font.h2, fontWeight: '800', color: colors.white, marginTop: spacing.md, writingDirection: 'rtl' },
  role: { fontSize: font.small, color: 'rgba(255,255,255,0.85)', marginTop: 4, writingDirection: 'rtl' },
  editBtn: { marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.xl, paddingVertical: 8 },
  editText: { color: colors.white, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },

  body: { paddingHorizontal: spacing.lg },
  scoreRow: { flexDirection: 'row-reverse', gap: spacing.md, marginTop: -spacing.lg },
  scoreBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  scoreValue: { fontSize: font.h1, fontWeight: '800', color: colors.primary },
  scoreLabel: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2, writingDirection: 'rtl' },
  scoreArrow: { position: 'absolute', top: 10, left: 10 },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, marginBottom: spacing.sm, writingDirection: 'rtl' },
  listCard: { paddingVertical: 0, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowText: { flex: 1 },
  rowTitle: { fontSize: font.body, color: colors.text, fontWeight: '600', textAlign: 'right', writingDirection: 'rtl' },
  rowValue: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },
  trailing: { fontSize: font.small, color: colors.textMuted, writingDirection: 'rtl' },
  premiumBadge: { backgroundColor: colors.goldSoft, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 3 },
  premiumText: { color: colors.gold, fontSize: font.tiny, fontWeight: '800', writingDirection: 'rtl' },

  skillsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, paddingVertical: spacing.lg },

  logout: { backgroundColor: colors.dangerBg, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: spacing.xl },
  logoutText: { color: colors.danger, fontWeight: '800', fontSize: font.body, writingDirection: 'rtl' },
});
