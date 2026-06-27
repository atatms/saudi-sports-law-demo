import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Avatar from '../components/Avatar';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { colors, font, radius, spacing, shadow } from '../theme';
import { getJobById } from '../data/jobs';
import { getRegionById } from '../data/regions';
import { formatSalary, workModeLabel, workModeIcon } from '../utils/format';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetails'>;

export default function JobDetailsScreen({ route, navigation }: Props) {
  const job = getJobById(route.params.jobId);

  if (!job) {
    return (
      <Screen>
        <TopBar title="تفاصيل الوظيفة" onBack={() => navigation.goBack()} />
        <Text style={styles.body}>لم يتم العثور على الوظيفة.</Text>
      </Screen>
    );
  }

  const region = getRegionById(job.regionId);
  const reqPct = (job.aiRequirementsMet / job.aiRequirementsTotal) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen>
        <TopBar title="تفاصيل الوظيفة" onBack={() => navigation.goBack()} />

        {/* Title block */}
        <View style={styles.titleRow}>
          <Avatar initials={job.companyShort} size={52} />
          <View style={{ flex: 1, marginHorizontal: spacing.md }}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>
              {job.company} · {job.city}
              {region ? `، ${region.name}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.tags}>
          <Chip label={formatSalary(job.salary)} />
          <Chip label={`${job.experienceYears} سنوات خبرة`} />
          <Chip label={workModeLabel(job.workMode)} icon={workModeIcon(job.workMode)} />
          <Chip label={job.fullTime ? 'دوام كامل' : 'دوام جزئي'} />
        </View>

        {/* AI match */}
        <Card style={styles.matchCard}>
          <View style={styles.matchTop}>
            <Ionicons name="sparkles" size={18} color={colors.primary} />
            <Text style={styles.matchTitle}>
              {job.matchScore}% تطابق مع الذكاء الاصطناعي
            </Text>
          </View>
          <Text style={styles.matchSub}>أفضل x{job.betterThan} من المتقدمين</Text>

          <View style={styles.reqHeader}>
            <Text style={styles.reqLabel}>تطابق متطلبات الذكاء الاصطناعي</Text>
            <Text style={styles.reqCount}>
              {job.aiRequirementsMet} / {job.aiRequirementsTotal}
            </Text>
          </View>
          <ProgressBar value={reqPct} />
          <Text style={styles.reqHint}>
            تطابق مع {job.aiRequirementsMet} من {job.aiRequirementsTotal} متطلبات رئيسية
          </Text>
        </Card>

        {/* About */}
        <Text style={styles.sectionTitle}>عن الوظيفة</Text>
        <Text style={styles.body}>{job.about}</Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>المتطلبات</Text>
        {job.requirements.map((r, i) => (
          <View key={i} style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.bulletText}>{r}</Text>
          </View>
        ))}

        {/* Company */}
        <Text style={styles.sectionTitle}>عن {job.company}</Text>
        <Text style={styles.body}>{job.companyAbout}</Text>

        <View style={{ height: 90 }} />
      </Screen>

      {/* Sticky apply bar */}
      <View style={[styles.applyBar, shadow.floating]}>
        <View>
          <Text style={styles.applyPrice}>{job.salary.toLocaleString('en-US')} ريال</Text>
          <Text style={styles.applyMonthly}>شهرياً</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85}>
          <Text style={styles.applyText}>قدم الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: spacing.sm },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  company: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 4, writingDirection: 'rtl' },

  tags: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: spacing.lg },

  matchCard: { marginTop: spacing.lg, backgroundColor: colors.primaryLight },
  matchTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  matchTitle: { fontSize: font.body, fontWeight: '800', color: colors.primaryDark, writingDirection: 'rtl' },
  matchSub: { fontSize: font.small, color: colors.primary, textAlign: 'right', marginTop: 4, writingDirection: 'rtl' },
  reqHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: 6 },
  reqLabel: { fontSize: font.small, color: colors.text, fontWeight: '600', writingDirection: 'rtl' },
  reqCount: { fontSize: font.small, color: colors.primaryDark, fontWeight: '800' },
  reqHint: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right', marginTop: 6, writingDirection: 'rtl' },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, marginBottom: spacing.sm, writingDirection: 'rtl' },
  body: { fontSize: font.body, color: colors.text, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' },

  bulletRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  bulletText: { flex: 1, fontSize: font.body, color: colors.text, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },

  applyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  applyPrice: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right' },
  applyMonthly: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right', writingDirection: 'rtl' },
  applyBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: 14 },
  applyText: { color: colors.white, fontWeight: '800', fontSize: font.body, writingDirection: 'rtl' },
});
