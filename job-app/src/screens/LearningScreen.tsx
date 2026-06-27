import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import SectionHeader from '../components/SectionHeader';
import ProgressBar from '../components/ProgressBar';
import StatTile from '../components/StatTile';
import { colors, font, radius, spacing } from '../theme';
import { courses, skillsToImprove, learningProgress } from '../data/learning';
import { Course } from '../data/types';

const LEVEL_LABEL: Record<Course['level'], string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

function CourseCard({ course }: { course: Course }) {
  return (
    <Card style={styles.courseCard}>
      <View style={styles.courseTop}>
        <View style={styles.topBadges}>
          {course.free ? (
            <View style={[styles.smallBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.smallBadgeText, { color: colors.primary }]}>مجانية</Text>
            </View>
          ) : null}
          {course.required ? (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>مطلوبة</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.courseTitle}>{course.title}</Text>
      </View>

      <View style={styles.courseMeta}>
        <Chip label={`${course.hours} ساعات`} icon="time-outline" />
        <Chip label={LEVEL_LABEL[course.level]} icon="bar-chart-outline" />
        {course.certificate ? <Chip label="شهادة معتمدة" icon="ribbon-outline" /> : null}
      </View>

      <View style={styles.courseFooter}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.85}>
          <Text style={styles.startText}>ابدأ الآن</Text>
        </TouchableOpacity>
        <View style={styles.provider}>
          <Ionicons name="school-outline" size={14} color={colors.textMuted} />
          <Text style={styles.providerText}>{course.provider}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function LearningScreen() {
  return (
    <Screen>
      <Text style={styles.title}>طوّر مهاراتك</Text>
      <Text style={styles.subtitle}>دورات مقترحة بناءً على ملفك وسوق العمل</Text>

      <TouchableOpacity activeOpacity={0.9} style={styles.banner}>
        <Ionicons name="chevron-back" size={18} color={colors.white} />
        <Text style={styles.bannerText}>نوصي بهذه الدورات لزيادة فرصك في التوظيف</Text>
        <Ionicons name="star" size={16} color={colors.white} />
      </TouchableOpacity>

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title="دورات مقترحة" actionLabel="عرض الكل" />
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>مهارات تحتاج تطويرها</Text>
      <Card style={{ marginTop: spacing.sm }}>
        <View style={styles.skillsWrap}>
          {skillsToImprove.map((s) => (
            <Chip key={s} label={s} variant="accent" />
          ))}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>تقدمك</Text>
      <Card style={{ marginTop: spacing.sm }}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressPct}>{learningProgress.percent}%</Text>
          <Text style={styles.progressLabel}>
            أكملت {learningProgress.completedCourses} من {learningProgress.totalCourses} دورات
          </Text>
        </View>
        <ProgressBar value={learningProgress.percent} />
        <View style={styles.tilesRow}>
          <StatTile value={learningProgress.newSkills} label="مهارات جديدة" icon="pulse-outline" />
          <StatTile value={learningProgress.learningHours} label="ساعة تعلم" icon="time-outline" iconColor={colors.gold} valueColor={colors.gold} />
          <StatTile value={learningProgress.certificates} label="شهادات" icon="ribbon-outline" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.sm, writingDirection: 'rtl' },
  subtitle: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 4, marginBottom: spacing.lg, writingDirection: 'rtl' },

  banner: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm },
  bannerText: { flex: 1, color: colors.white, fontSize: font.small, fontWeight: '600', textAlign: 'right', writingDirection: 'rtl' },

  courseCard: { marginBottom: spacing.md },
  courseTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  courseTitle: { flex: 1, fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  topBadges: { flexDirection: 'row-reverse', gap: 6 },
  smallBadge: { borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4 },
  smallBadgeText: { fontSize: font.tiny, fontWeight: '800', writingDirection: 'rtl' },
  requiredBadge: { backgroundColor: colors.accentSoft, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4 },
  requiredText: { color: colors.accentText, fontSize: font.tiny, fontWeight: '700', writingDirection: 'rtl' },
  courseMeta: { flexDirection: 'row-reverse', gap: 6, marginTop: spacing.md },
  courseFooter: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  startBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: 10 },
  startText: { color: colors.white, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },
  provider: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  providerText: { fontSize: font.small, color: colors.textMuted, writingDirection: 'rtl' },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, writingDirection: 'rtl' },
  skillsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },

  progressHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  progressPct: { fontSize: font.body, fontWeight: '800', color: colors.primary },
  progressLabel: { fontSize: font.small, color: colors.text, fontWeight: '600', writingDirection: 'rtl' },
  tilesRow: { flexDirection: 'row-reverse', gap: spacing.sm, marginTop: spacing.lg },
});
