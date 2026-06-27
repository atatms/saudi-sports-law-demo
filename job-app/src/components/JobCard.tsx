import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../data/types';
import { colors, font, radius, spacing, shadow } from '../theme';
import { formatSalary, workModeLabel, workModeIcon, matchColor } from '../utils/format';
import { getPlatformById } from '../data/platforms';
import Avatar from './Avatar';
import Chip from './Chip';

interface Props {
  job: Job;
  onPress?: () => void;
  onApply?: () => void;
  onToggleSave?: () => void;
  primaryLabel?: string;
}

/** Job listing card matching the "اكتشف الوظائف" / home design. */
export default function JobCard({ job, onPress, onApply, onToggleSave, primaryLabel }: Props) {
  const platform = getPlatformById(job.sourceId);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, shadow.card]}>
      <View style={styles.header}>
        <Avatar initials={job.companyShort} />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {job.company} · {job.city}
          </Text>
        </View>
        <View style={[styles.matchBadge, { backgroundColor: colors.successBg }]}>
          <Text style={[styles.matchPct, { color: matchColor(job.matchScore) }]}>{job.matchScore}%</Text>
          <Text style={styles.matchWord}>تطابق</Text>
        </View>
      </View>

      {/* Source platform + new flag */}
      <View style={styles.sourceRow}>
        {platform ? (
          <View style={styles.sourcePill}>
            <View style={[styles.sourceDot, { backgroundColor: platform.color }]} />
            <Text style={styles.sourceText}>عبر {platform.name}</Text>
          </View>
        ) : (
          <View />
        )}
        {job.isNew ? (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>جديد</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.tags}>
        <Chip label={formatSalary(job.salary)} />
        <Chip label={`${job.experienceYears} سنوات خبرة`} />
        <Chip label={workModeLabel(job.workMode)} icon={workModeIcon(job.workMode)} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={onToggleSave} hitSlop={8}>
          <Ionicons
            name={job.saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={job.saved ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={onApply} activeOpacity={0.85}>
          <Text style={styles.applyText}>{primaryLabel ?? (job.matchScore >= 80 ? 'قدم الآن' : 'عرض الوظيفة')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row-reverse', alignItems: 'center' },
  headerText: { flex: 1, marginHorizontal: spacing.md },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  company: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },
  matchBadge: { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  matchPct: { fontSize: font.body, fontWeight: '800' },
  matchWord: { fontSize: font.tiny, color: colors.textMuted },
  sourceRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  sourcePill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  sourceDot: { width: 8, height: 8, borderRadius: 4 },
  sourceText: { fontSize: font.tiny, color: colors.textMuted, fontWeight: '600', writingDirection: 'rtl' },
  newBadge: { backgroundColor: colors.goldSoft, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2 },
  newText: { fontSize: font.tiny, color: colors.gold, fontWeight: '800', writingDirection: 'rtl' },
  tags: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  actions: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  saveBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyText: { color: colors.white, fontWeight: '700', fontSize: font.body, writingDirection: 'rtl' },
});
