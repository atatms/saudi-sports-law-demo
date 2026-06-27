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
import { useLang } from '../context/LanguageContext';

const LEVEL_LABEL: Record<Course['level'], string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};
const LEVEL_EN: Record<Course['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function CourseCard({ course }: { course: Course }) {
  const { L, lang, isRTL } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';
  return (
    <Card style={styles.courseCard}>
      <View style={[styles.courseTop, { flexDirection: row }]}>
        <View style={[styles.topBadges, { flexDirection: row }]}>
          {course.free ? (
            <View style={[styles.smallBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.smallBadgeText, { color: colors.primary }]}>{L('مجانية', 'Free')}</Text>
            </View>
          ) : null}
          {course.required ? (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>{L('مطلوبة', 'Required')}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.courseTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{course.title}</Text>
      </View>

      <View style={[styles.courseMeta, { flexDirection: row }]}>
        <Chip label={`${course.hours} ${L('ساعات', 'hrs')}`} icon="time-outline" />
        <Chip label={lang === 'ar' ? LEVEL_LABEL[course.level] : LEVEL_EN[course.level]} icon="bar-chart-outline" />
        {course.certificate ? <Chip label={L('شهادة معتمدة', 'Certificate')} icon="ribbon-outline" /> : null}
      </View>

      <View style={[styles.courseFooter, { flexDirection: row }]}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.85}>
          <Text style={styles.startText}>{L('ابدأ الآن', 'Start now')}</Text>
        </TouchableOpacity>
        <View style={[styles.provider, { flexDirection: row }]}>
          <Ionicons name="school-outline" size={14} color={colors.textMuted} />
          <Text style={styles.providerText}>{course.provider}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function LearningScreen() {
  const { L, isRTL } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';
  const ta = isRTL ? 'right' : 'left';
  return (
    <Screen>
      <Text style={[styles.title, { textAlign: ta }]}>{L('طوّر مهاراتك', 'Grow your skills')}</Text>
      <Text style={[styles.subtitle, { textAlign: ta }]}>{L('دورات مقترحة بناءً على ملفك وسوق العمل', 'Courses tailored to your profile and the job market')}</Text>

      <TouchableOpacity activeOpacity={0.9} style={[styles.banner, { flexDirection: row }]}>
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.white} />
        <Text style={[styles.bannerText, { textAlign: ta }]}>{L('نوصي بهذه الدورات لزيادة فرصك في التوظيف', 'Recommended courses to boost your hiring chances')}</Text>
        <Ionicons name="star" size={16} color={colors.white} />
      </TouchableOpacity>

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title={L('دورات مقترحة', 'Suggested courses')} actionLabel={L('عرض الكل', 'See all')} />
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('مهارات تحتاج تطويرها', 'Skills to improve')}</Text>
      <Card style={{ marginTop: spacing.sm }}>
        <View style={[styles.skillsWrap, { flexDirection: row }]}>
          {skillsToImprove.map((s) => (
            <Chip key={s} label={s} variant="accent" />
          ))}
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('تقدمك', 'Your progress')}</Text>
      <Card style={{ marginTop: spacing.sm }}>
        <View style={[styles.progressHeader, { flexDirection: row }]}>
          <Text style={styles.progressPct}>{learningProgress.percent}%</Text>
          <Text style={styles.progressLabel}>
            {L(
              `أكملت ${learningProgress.completedCourses} من ${learningProgress.totalCourses} دورات`,
              `Completed ${learningProgress.completedCourses} of ${learningProgress.totalCourses} courses`,
            )}
          </Text>
        </View>
        <ProgressBar value={learningProgress.percent} />
        <View style={[styles.tilesRow, { flexDirection: row }]}>
          <StatTile value={learningProgress.newSkills} label={L('مهارات جديدة', 'New skills')} icon="pulse-outline" />
          <StatTile value={learningProgress.learningHours} label={L('ساعة تعلم', 'Learning hrs')} icon="time-outline" iconColor={colors.gold} valueColor={colors.gold} />
          <StatTile value={learningProgress.certificates} label={L('شهادات', 'Certificates')} icon="ribbon-outline" />
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
