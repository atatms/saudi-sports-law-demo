import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { WorkMode } from '../data/types';
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

export default function JobsScreen({ navigation, route }: Props) {
  const [regionId, setRegionId] = useState<string>(route.params?.regionId ?? ALL_REGIONS_ID);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(allJobs.map((j) => [j.id, j.saved])),
  );

  const filtered = useMemo(() => {
    return allJobs
      .filter((j) => (regionId === ALL_REGIONS_ID ? true : j.regionId === regionId))
      .filter((j) => (mode === 'all' ? true : mode === 'highpay' ? j.salary >= 15000 : j.workMode === mode))
      .filter((j) =>
        query.trim() === ''
          ? true
          : `${j.title} ${j.company} ${j.city}`.includes(query.trim()),
      )
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [regionId, mode, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>اكتشف الوظائف</Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="المسمى الوظيفي، الشركة، المهارة..."
              placeholderTextColor={colors.textFaint}
              value={query}
              onChangeText={setQuery}
              textAlign="right"
            />
          </View>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </View>
        </View>

        {/* Region dropdown (requested feature) */}
        <View style={styles.regionRow}>
          <RegionDropdown selectedId={regionId} onSelect={setRegionId} />
          <Text style={styles.regionHint}>تصفية حسب المنطقة الإدارية</Text>
        </View>

        {/* Mode filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {MODE_FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              active={mode === f.id}
              onPress={() => setMode(f.id)}
            />
          ))}
        </ScrollView>

        <Text style={styles.count}>
          {filtered.length} وظيفة · مرتبة حسب تطابق الذكاء الاصطناعي
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={42} color={colors.textFaint} />
            <Text style={styles.emptyText}>لا توجد وظائف مطابقة في هذه المنطقة</Text>
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
  count: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginBottom: spacing.sm, writingDirection: 'rtl' },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: font.body, writingDirection: 'rtl' },
});
