import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '../components/Card';
import Avatar from '../components/Avatar';
import { colors, font, radius, spacing } from '../theme';
import { applications, applicationStats } from '../data/applications';
import { Application, ApplicationStatus } from '../data/types';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Applications'>,
  NativeStackScreenProps<RootStackParamList>
>;

type TabKey = 'all' | 'active' | 'interview' | 'offer';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'النشطة' },
  { key: 'interview', label: 'المقابلات' },
  { key: 'offer', label: 'العروض' },
];

const TAB_EN: Record<TabKey, string> = {
  all: 'All',
  active: 'Active',
  interview: 'Interviews',
  offer: 'Offers',
};

const STAGES = ['تم التقديم', 'مراجعة', 'مقابلة', 'عرض', 'نهائي'];
const STAGES_EN = ['Applied', 'Review', 'Interview', 'Offer', 'Final'];

const STATUS_META: Record<ApplicationStatus, { label: string; labelEn: string; bg: string; fg: string; stageIndex: number }> = {
  applied: { label: 'تم التقديم', labelEn: 'Applied', bg: colors.chipBg, fg: colors.textMuted, stageIndex: 0 },
  review: { label: 'مراجعة', labelEn: 'Review', bg: colors.goldSoft, fg: colors.gold, stageIndex: 1 },
  interview: { label: 'مقابلة', labelEn: 'Interview', bg: colors.primaryLight, fg: colors.primary, stageIndex: 2 },
  offer: { label: 'عرض', labelEn: 'Offer', bg: colors.successBg, fg: colors.primary, stageIndex: 3 },
  rejected: { label: 'لم يتم الاختيار', labelEn: 'Not selected', bg: colors.dangerBg, fg: colors.danger, stageIndex: 1 },
};

function Pipeline({ status }: { status: ApplicationStatus }) {
  const { lang } = useLang();
  const stages = lang === 'ar' ? STAGES : STAGES_EN;
  const idx = STATUS_META[status].stageIndex;
  const rejected = status === 'rejected';
  return (
    <View style={styles.pipeline}>
      {stages.map((s, i) => {
        const done = !rejected && i <= idx;
        return (
          <View key={s} style={styles.stage}>
            <View
              style={[
                styles.stageDot,
                done && { backgroundColor: colors.primary, borderColor: colors.primary },
                rejected && i === idx && { backgroundColor: colors.danger, borderColor: colors.danger },
              ]}
            />
            <Text style={[styles.stageLabel, done && { color: colors.primary, fontWeight: '700' }]}>{s}</Text>
          </View>
        );
      })}
    </View>
  );
}

function ApplicationItem({ app, onView }: { app: Application; onView: () => void }) {
  const { L, lang, isRTL } = useLang();
  const meta = STATUS_META[app.status];
  const rowDir = isRTL ? 'row-reverse' : 'row';
  return (
    <Card style={styles.appCard}>
      <View style={[styles.appHeader, { flexDirection: rowDir }]}>
        <Avatar initials={app.companyShort} size={40} />
        <View style={{ flex: 1, marginHorizontal: spacing.md }}>
          <Text style={[styles.appTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{app.title}</Text>
          <Text style={[styles.appCompany, { textAlign: isRTL ? 'right' : 'left' }]}>{app.company} · {app.city}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.statusText, { color: meta.fg }]}>{lang === 'ar' ? meta.label : meta.labelEn}</Text>
        </View>
      </View>

      <Pipeline status={app.status} />

      {app.note ? (
        <View style={[styles.noteBox, { flexDirection: rowDir }]}>
          <Ionicons
            name={app.status === 'interview' ? 'calendar-outline' : app.status === 'offer' ? 'cash-outline' : 'time-outline'}
            size={15}
            color={colors.primary}
          />
          <Text style={[styles.noteText, { textAlign: isRTL ? 'right' : 'left' }]}>{app.note}</Text>
        </View>
      ) : (
        <Text style={[styles.dateText, { textAlign: isRTL ? 'right' : 'left' }]}>{app.dateLabel}</Text>
      )}

      <View style={[styles.appActions, { flexDirection: rowDir }]}>
        {app.status === 'interview' && (
          <TouchableOpacity style={styles.primaryAction} activeOpacity={0.85}>
            <Ionicons name="sparkles" size={15} color={colors.white} />
            <Text style={styles.primaryActionText}>{L('الاستعداد بالذكاء الاصطناعي', 'Prepare with AI')}</Text>
          </TouchableOpacity>
        )}
        {app.status === 'offer' && (
          <>
            <TouchableOpacity style={styles.ghostAction} activeOpacity={0.85}>
              <Text style={styles.ghostActionText}>{L('تفاوض', 'Negotiate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryAction} activeOpacity={0.85}>
              <Text style={styles.primaryActionText}>{L('قبول', 'Accept')}</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.ghostAction} activeOpacity={0.85} onPress={onView}>
          <Text style={styles.ghostActionText}>{L('عرض', 'View')}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function ApplicationsScreen({ navigation }: Props) {
  const { L, isRTL } = useLang();
  const [tab, setTab] = useState<TabKey>('all');

  const filtered = useMemo(() => {
    switch (tab) {
      case 'active':
        return applications.filter((a) => a.status !== 'rejected');
      case 'interview':
        return applications.filter((a) => a.status === 'interview');
      case 'offer':
        return applications.filter((a) => a.status === 'offer');
      default:
        return applications;
    }
  }, [tab]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.title}>{L('طلباتي', 'My applications')}</Text>
          <Text style={styles.total}>{applicationStats.total} {L('إجمالي', 'total')}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tabs, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{L(t.label, TAB_EN[t.key])}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((app) => (
          <ApplicationItem
            key={app.id}
            app={app}
            onView={() => navigation.navigate('JobDetails', { jobId: app.jobId })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text, writingDirection: 'rtl' },
  total: { fontSize: font.small, color: colors.textMuted, writingDirection: 'rtl' },

  tabs: { flexDirection: 'row-reverse', gap: 8, paddingVertical: spacing.md },
  tab: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: font.small, color: colors.text, fontWeight: '600', writingDirection: 'rtl' },
  tabTextActive: { color: colors.white },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  appCard: { marginBottom: spacing.md },
  appHeader: { flexDirection: 'row-reverse', alignItems: 'center' },
  appTitle: { fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  appCompany: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  statusText: { fontSize: font.tiny, fontWeight: '700', writingDirection: 'rtl' },

  pipeline: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm },
  stage: { alignItems: 'center', flex: 1 },
  stageDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 6 },
  stageLabel: { fontSize: 9, color: colors.textFaint, writingDirection: 'rtl' },

  noteBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: colors.cardAlt, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 8, marginTop: spacing.sm },
  noteText: { fontSize: font.small, color: colors.text, fontWeight: '600', flex: 1, textAlign: 'right', writingDirection: 'rtl' },
  dateText: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: spacing.sm, writingDirection: 'rtl' },

  appActions: { flexDirection: 'row-reverse', gap: spacing.sm, marginTop: spacing.md },
  primaryAction: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 10, flex: 1, justifyContent: 'center' },
  primaryActionText: { color: colors.white, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },
  ghostAction: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  ghostActionText: { color: colors.text, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },
});
