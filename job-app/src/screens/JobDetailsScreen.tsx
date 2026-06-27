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
import { useLang } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetails'>;

export default function JobDetailsScreen({ route, navigation }: Props) {
  const { L, lang, isRTL } = useLang();
  const job = getJobById(route.params.jobId);
  const ta = isRTL ? 'right' : 'left';
  const row = isRTL ? 'row-reverse' : 'row';

  if (!job) {
    return (
      <Screen>
        <TopBar title={L('تفاصيل الوظيفة', 'Job details')} onBack={() => navigation.goBack()} />
        <Text style={styles.body}>{L('لم يتم العثور على الوظيفة.', 'Job not found.')}</Text>
      </Screen>
    );
  }

  const region = getRegionById(job.regionId);
  const reqPct = (job.aiRequirementsMet / job.aiRequirementsTotal) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen>
        <TopBar title={L('تفاصيل الوظيفة', 'Job details')} onBack={() => navigation.goBack()} />

        {/* Title block */}
        <View style={[styles.titleRow, { flexDirection: row }]}>
          <Avatar initials={job.companyShort} size={52} />
          <View style={{ flex: 1, marginHorizontal: spacing.md }}>
            <Text style={[styles.title, { textAlign: ta }]}>{job.title}</Text>
            <Text style={[styles.company, { textAlign: ta }]}>
              {job.company} · {job.city}
              {region ? `، ${region.name}` : ''}
            </Text>
          </View>
        </View>

        <View style={[styles.tags, { flexDirection: row }]}>
          <Chip label={formatSalary(job.salary, lang)} />
          <Chip label={L(`${job.experienceYears} سنوات خبرة`, `${job.experienceYears} yrs exp`)} />
          <Chip label={workModeLabel(job.workMode, lang)} icon={workModeIcon(job.workMode)} />
          <Chip label={job.fullTime ? L('دوام كامل', 'Full-time') : L('دوام جزئي', 'Part-time')} />
        </View>

        {/* AI match */}
        <Card style={styles.matchCard}>
          <View style={[styles.matchTop, { flexDirection: row }]}>
            <Ionicons name="sparkles" size={18} color={colors.primary} />
            <Text style={styles.matchTitle}>
              {L(`${job.matchScore}% تطابق مع الذكاء الاصطناعي`, `${job.matchScore}% AI match`)}
            </Text>
          </View>
          <Text style={[styles.matchSub, { textAlign: ta }]}>{L(`أفضل x${job.betterThan} من المتقدمين`, `${job.betterThan}× better than applicants`)}</Text>

          <View style={[styles.reqHeader, { flexDirection: row }]}>
            <Text style={styles.reqLabel}>{L('تطابق متطلبات الذكاء الاصطناعي', 'AI requirements match')}</Text>
            <Text style={styles.reqCount}>
              {job.aiRequirementsMet} / {job.aiRequirementsTotal}
            </Text>
          </View>
          <ProgressBar value={reqPct} />
          <Text style={[styles.reqHint, { textAlign: ta }]}>
            {L(`تطابق مع ${job.aiRequirementsMet} من ${job.aiRequirementsTotal} متطلبات رئيسية`, `Matched ${job.aiRequirementsMet} of ${job.aiRequirementsTotal} key requirements`)}
          </Text>
        </Card>

        {/* About */}
        <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('عن الوظيفة', 'About the role')}</Text>
        <Text style={[styles.body, { textAlign: ta }]}>{job.about}</Text>

        {/* Requirements */}
        <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('المتطلبات', 'Requirements')}</Text>
        {job.requirements.map((r, i) => (
          <View key={i} style={[styles.bulletRow, { flexDirection: row }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={[styles.bulletText, { textAlign: ta }]}>{r}</Text>
          </View>
        ))}

        {/* Company */}
        <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L(`عن ${job.company}`, `About ${job.company}`)}</Text>
        <Text style={[styles.body, { textAlign: ta }]}>{job.companyAbout}</Text>

        <View style={{ height: 90 }} />
      </Screen>

      {/* Sticky apply bar */}
      <View style={[styles.applyBar, shadow.floating, { flexDirection: row }]}>
        <View>
          <Text style={styles.applyPrice}>{job.salary.toLocaleString('en-US')} {L('ريال', 'SAR')}</Text>
          <Text style={styles.applyMonthly}>{L('شهرياً', 'monthly')}</Text>
        </View>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('UploadCv', { jobId: job.id })}
        >
          <Text style={styles.applyText}>{L('قدّم بسيرتك الذاتية', 'Apply with your CV')}</Text>
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
