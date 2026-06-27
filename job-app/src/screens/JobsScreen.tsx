import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ionicons as Icon } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import JobCard from '../components/JobCard';
import Chip from '../components/Chip';
import RegionDropdown from '../components/RegionDropdown';
import { colors, font, radius, spacing } from '../theme';
import { jobs as allJobs } from '../data/jobs';
import { ALL_REGIONS_ID } from '../data/regions';
import { jobPlatforms } from '../data/platforms';
import { WorkMode } from '../data/types';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Jobs'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ModeFilter = 'all' | WorkMode | 'highpay';

const MODE_FILTERS: { id: ModeFilter; label: string }[] = [
  { id: 'all', label: 'جميع الوظائف' },
  { id: 'highpay', label: '15+ ألف ريال' },
  { id: 'hybrid', label: 'هجين' },
  { id: 'remote', label: 'عن بعد' },
  { id: 'onsite', label: 'في الموقع' },
];

const MODE_FILTERS_EN: Record<ModeFilter, string> = {
  all: 'All jobs',
  highpay: '15K+ SAR',
  hybrid: 'Hybrid',
  remote: 'Remote',
  onsite: 'On-site',
};

export default function JobsScreen({ navigation, route }: Props) {
  const { connectedPlatformIds, user } = useAuth();
  const { L, isRTL } = useLang();
  const [regionId, setRegionId] = useState<string>(route.params?.regionId ?? ALL_REGIONS_ID);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(allJobs.map((j) => [j.id, j.saved])),
  );

  // Only jobs coming from platforms the user has linked appear in the feed.
  const fromConnected = useMemo(
    () => allJobs.filter((j) => connectedPlatformIds.includes(j.sourceId)),
    [connectedPlatformIds],
  );
  const newCount = fromConnected.filter((j) => j.isNew).length;
  const connectedNames = jobPlatforms
    .filter((p) => connectedPlatformIds.includes(p.id))
    .map((p) => p.name);

  // A job suits the applicant when its required experience is within reach.
  const suits = (jobYears: number) =>
    user?.experienceYears == null ? true : jobYears <= user.experienceYears + 1;

  const filtered = useMemo(() => {
    return fromConnected
      .filter((j) => (regionId === ALL_REGIONS_ID ? true : j.regionId === regionId))
      .filter((j) => (mode === 'all' ? true : mode === 'highpay' ? j.salary >= 15000 : j.workMode === mode))
      .filter((j) =>
        query.trim() === ''
          ? true
          : `${j.title} ${j.company} ${j.city}`.includes(query.trim()),
      )
      // Suitable-by-experience first, then by AI match score.
      .sort((a, b) => {
        const sa = suits(a.experienceYears) ? 1 : 0;
        const sb = suits(b.experienceYears) ? 1 : 0;
        if (sa !== sb) return sb - sa;
        return b.matchScore - a.matchScore;
      });
  }, [fromConnected, regionId, mode, query, user?.experienceYears]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>{L('اكتشف الوظائف', 'Discover jobs')}</Text>

        {/* Connected-platforms banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.connBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={() => navigation.navigate('ConnectPlatforms')}
        >
          <Icon name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.connTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {connectedNames.length > 0
                ? L(`${newCount} وظيفة جديدة من منصاتك المرتبطة`, `${newCount} new jobs from your linked platforms`)
                : L('اربط منصات التوظيف لعرض الوظائف', 'Link job platforms to see jobs')}
            </Text>
            <Text style={[styles.connSub, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {connectedNames.length > 0
                ? connectedNames.join(L('، ', ', '))
                : L('اضغط هنا للربط — تُسحب الوظائف تلقائياً', 'Tap to link — jobs are pulled automatically')}
            </Text>
          </View>
          <Icon name="git-network-outline" size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* Search */}
        <View style={[styles.searchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.searchBox, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={L('المسمى الوظيفي، الشركة، المهارة...', 'Job title, company, skill...')}
              placeholderTextColor={colors.textFaint}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </View>
        </View>

        {/* Region dropdown (requested feature) */}
        <View style={[styles.regionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <RegionDropdown selectedId={regionId} onSelect={setRegionId} />
          <Text style={styles.regionHint}>{L('تصفية حسب المنطقة الإدارية', 'Filter by region')}</Text>
        </View>

        {/* Mode filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filtersRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
          {MODE_FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={L(f.label, MODE_FILTERS_EN[f.id])}
              active={mode === f.id}
              onPress={() => setMode(f.id)}
            />
          ))}
        </ScrollView>

        {/* Tailoring line by the user's degree + field + experience */}
        {(user?.specialization || user?.experienceYears != null) ? (
          <Text style={[styles.tailor, { textAlign: isRTL ? 'right' : 'left' }]}>
            {L(
              `مقترحة بناءً على ${user?.specialization ? `تخصص «${user.specialization}»` : 'ملفك'}${user?.experienceYears != null ? ` و${user.experienceYears} سنوات خبرة` : ''}`,
              `Based on ${user?.specialization ? `"${user.specialization}"` : 'your profile'}${user?.experienceYears != null ? ` and ${user.experienceYears} yrs experience` : ''}`,
            )}
          </Text>
        ) : null}

        <Text style={[styles.count, { textAlign: isRTL ? 'right' : 'left' }]}>
          {filtered.length} {L('وظيفة · مرتبة حسب تطابق الذكاء الاصطناعي', 'jobs · ranked by AI match')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="git-network-outline" size={42} color={colors.textFaint} />
            <Text style={styles.emptyText}>
              {connectedPlatformIds.length === 0
                ? L('لم تربط أي منصة بعد', 'You haven\'t linked any platform yet')
                : L('لا توجد وظائف مطابقة لهذه التصفية', 'No jobs match this filter')}
            </Text>
            {connectedPlatformIds.length === 0 ? (
              <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('ConnectPlatforms')}>
                <Text style={styles.linkBtnText}>{L('ربط منصات التوظيف', 'Link job platforms')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          filtered.map((job) => (
            <JobCard
              key={job.id}
              job={{ ...job, saved: savedMap[job.id] }}
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
              onApply={() => navigation.navigate('JobDetails', { jobId: job.id })}
              onToggleSave={() =>
                setSavedMap((m) => ({ ...m, [job.id]: !m[job.id] }))
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerArea: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },

  connBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  connTitle: { fontSize: font.small, fontWeight: '800', color: colors.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  connSub: { fontSize: font.tiny, color: colors.primary, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },

  searchRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  searchBox: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: font.body, color: colors.text, writingDirection: 'rtl' },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  regionRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  regionHint: { fontSize: font.tiny, color: colors.textMuted, writingDirection: 'rtl' },

  filtersRow: { flexDirection: 'row-reverse', gap: 8, paddingVertical: spacing.md },
  count: { fontSize: font.small, color: colors.textMuted, marginBottom: spacing.sm },
  tailor: { fontSize: font.small, color: colors.primary, fontWeight: '700', marginTop: spacing.xs },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: font.body },
  linkBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: 12 },
  linkBtnText: { color: colors.white, fontWeight: '800', fontSize: font.body },
});
