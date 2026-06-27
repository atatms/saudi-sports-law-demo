import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Chip from '../components/Chip';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';
import { colors, font, radius, spacing } from '../theme';
import { resumeScore, resumeBreakdown } from '../data/profile';
import { skillsToImprove, recommendedCoursesForSkills } from '../data/learning';
import { getJobById } from '../data/jobs';
import { Course } from '../data/types';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadCv'>;
type Phase = 'idle' | 'analyzing' | 'done';

const LEVEL: Record<Course['level'], [string, string]> = {
  beginner: ['مبتدئ', 'Beginner'],
  intermediate: ['متوسط', 'Intermediate'],
  advanced: ['متقدم', 'Advanced'],
};

function barColor(s: number) {
  if (s >= 80) return colors.primary;
  if (s >= 60) return colors.gold;
  return colors.danger;
}

function CourseRow({ course }: { course: Course }) {
  const { L, lang, isRTL } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';
  const ta = isRTL ? 'right' : 'left';
  return (
    <Card style={styles.courseCard}>
      <View style={[styles.courseHead, { flexDirection: row }]}>
        <View style={[styles.courseBadges, { flexDirection: row }]}>
          {course.free ? (
            <View style={[styles.tagBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{L('مجانية', 'Free')}</Text>
            </View>
          ) : null}
          {course.certificate ? (
            <View style={[styles.tagBadge, { backgroundColor: colors.goldSoft }]}>
              <Text style={[styles.tagText, { color: colors.gold }]}>{L('شهادة معتمدة', 'Certificate')}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.courseTitle, { textAlign: ta }]}>{course.title}</Text>
      </View>
      <Text style={[styles.courseGap, { textAlign: ta }]}>{L('يسدّ فجوة', 'Closes gap')}: {course.skill}</Text>
      <View style={[styles.courseMeta, { flexDirection: row }]}>
        <Chip label={`${course.hours} ${L('ساعات', 'hrs')}`} icon="time-outline" />
        <Chip label={lang === 'ar' ? LEVEL[course.level][0] : LEVEL[course.level][1]} icon="bar-chart-outline" />
        <Chip label={course.provider} icon="school-outline" />
      </View>
      <Button label={L('التسجيل في الدورة', 'Enroll in course')} onPress={() => {}} style={styles.courseBtn} />
    </Card>
  );
}

export default function UploadCvScreen({ navigation, route }: Props) {
  const { cv, setCv } = useAuth();
  const { L, isRTL } = useLang();
  const ta = isRTL ? 'right' : 'left';
  const row = isRTL ? 'row-reverse' : 'row';
  const job = route.params?.jobId ? getJobById(route.params.jobId) : undefined;
  const [phase, setPhase] = useState<Phase>(cv.analyzed ? 'done' : 'idle');

  const startUpload = () => {
    setCv({ uploaded: true, fileName: 'Ahmad_Resume_2024.pdf', analyzed: false });
    setPhase('analyzing');
    // Simulate AI analysis.
    setTimeout(() => {
      setCv({ uploaded: true, fileName: 'Ahmad_Resume_2024.pdf', analyzed: true });
      setPhase('done');
    }, 2200);
  };

  const recommended = recommendedCoursesForSkills(skillsToImprove);

  return (
    <Screen>
      <TopBar title={L('رفع وتحليل السيرة الذاتية', 'Upload & analyze CV')} onBack={() => navigation.goBack()} />

      {job ? (
        <Card style={[styles.jobCard, { flexDirection: row }]}>
          <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
          <Text style={[styles.jobText, { textAlign: ta }]}>{L('التقديم على', 'Applying to')}: {job.title} — {job.company}</Text>
        </Card>
      ) : null}

      {/* IDLE */}
      {phase === 'idle' && (
        <>
          <TouchableOpacity style={styles.dropzone} activeOpacity={0.85} onPress={startUpload}>
            <View style={styles.dropIcon}>
              <Ionicons name="cloud-upload-outline" size={34} color={colors.primary} />
            </View>
            <Text style={styles.dropTitle}>{L('ارفع سيرتك الذاتية', 'Upload your CV')}</Text>
            <Text style={styles.dropSub}>{L('PDF أو Word — حتى 5 ميجابايت', 'PDF or Word — up to 5 MB')}</Text>
            <View style={styles.dropBtn}>
              <Text style={styles.dropBtnText}>{L('اختيار ملف', 'Choose file')}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.hint}>
            {L(
              'سيقوم الذكاء الاصطناعي بتحليل سيرتك الذاتية، وحساب توافقها مع أنظمة التوظيف، واقتراح دورات تطويرية لسد الفجوات.',
              'AI will analyze your CV, score its ATS compatibility, and recommend courses to close your skill gaps.',
            )}
          </Text>
        </>
      )}

      {/* ANALYZING */}
      {phase === 'analyzing' && (
        <Card style={styles.analyzing}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.analyzingTitle}>{L('جارٍ تحليل سيرتك الذاتية...', 'Analyzing your CV...')}</Text>
          <Text style={styles.analyzingSub}>{L('قراءة الخبرات والمهارات ومطابقتها بسوق العمل', 'Reading experience & skills and matching the job market')}</Text>
        </Card>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <>
          <View style={styles.scoreWrap}>
            <ScoreRing score={resumeScore} size={110} strokeWidth={9} color={colors.gold} />
            <Text style={styles.scoreLabel}>{L('نتيجة سيرتك الذاتية — فوق المتوسط', 'Your CV score — above average')}</Text>
          </View>

          <View style={[styles.detailsHeader, { flexDirection: row }]}>
            <TouchableOpacity onPress={() => navigation.navigate('ResumeAnalyzer')}>
              <Text style={styles.detailsLink}>{L('التحليل الكامل', 'Full analysis')}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{L('تفاصيل النتيجة', 'Score breakdown')}</Text>
          </View>
          <Card flat>
            {resumeBreakdown.map((b) => (
              <View key={b.label} style={[styles.breakRow, { flexDirection: row }]}>
                <Text style={styles.breakScore}>{b.score}%</Text>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={b.score} color={barColor(b.score)} height={7} />
                </View>
                <Text style={[styles.breakLabel, { textAlign: ta }]}>{b.label}</Text>
              </View>
            ))}
          </Card>

          {/* Gap analysis */}
          <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('مهارات تحتاج إلى تطوير', 'Skills to develop')}</Text>
          <Card flat style={{ marginTop: spacing.sm }}>
            <View style={[styles.skillsWrap, { flexDirection: row }]}>
              {skillsToImprove.map((s) => (
                <Chip key={s} label={s} variant="accent" />
              ))}
            </View>
          </Card>

          {/* Recommended free courses */}
          <View style={[styles.recHeader, { flexDirection: row }]}>
            <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{L('دورات مجانية موصى بها لتطويرك', 'Recommended free courses')}</Text>
          </View>
          <Text style={[styles.recSub, { textAlign: ta }]}>
            {L(
              'دورات معتمدة من منصات سعودية (هدف/دروب، أكاديمية طويق) تمنح شهادات مجانية لسد الفجوات في سيرتك الذاتية.',
              'Accredited courses from Saudi platforms (HRDF/Doroob, Tuwaiq Academy) granting free certificates to close your CV gaps.',
            )}
          </Text>
          {recommended.map((c) => (
            <CourseRow key={c.id} course={c} />
          ))}

          <Button
            label={L('عرض جميع الدورات', 'View all courses')}
            variant="outline"
            onPress={() => navigation.navigate('Tabs', { screen: 'Learning' })}
            style={{ marginTop: spacing.sm }}
          />

          {job ? (
            <Button
              label={L('إكمال التقديم على الوظيفة', 'Complete job application')}
              onPress={() => navigation.goBack()}
              style={{ marginTop: spacing.md }}
            />
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  jobCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primaryLight, marginTop: spacing.sm },
  jobText: { flex: 1, fontSize: font.small, color: colors.primaryDark, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },

  dropzone: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primaryMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginTop: spacing.lg,
  },
  dropIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  dropTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginTop: spacing.md, writingDirection: 'rtl' },
  dropSub: { fontSize: font.small, color: colors.textMuted, marginTop: 4, writingDirection: 'rtl' },
  dropBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: 12, marginTop: spacing.lg },
  dropBtnText: { color: colors.white, fontWeight: '800', fontSize: font.body, writingDirection: 'rtl' },
  hint: { fontSize: font.small, color: colors.textMuted, lineHeight: 22, textAlign: 'center', marginTop: spacing.lg, writingDirection: 'rtl' },

  analyzing: { alignItems: 'center', paddingVertical: spacing.xxl, marginTop: spacing.lg },
  analyzingTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginTop: spacing.lg, writingDirection: 'rtl' },
  analyzingSub: { fontSize: font.small, color: colors.textMuted, textAlign: 'center', marginTop: 6, writingDirection: 'rtl' },

  scoreWrap: { alignItems: 'center', marginTop: spacing.lg },
  scoreLabel: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.md, writingDirection: 'rtl' },

  detailsHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl },
  detailsLink: { fontSize: font.small, color: colors.primary, fontWeight: '700', writingDirection: 'rtl' },
  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginBottom: spacing.sm, writingDirection: 'rtl' },

  breakRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  breakScore: { width: 44, fontSize: font.small, fontWeight: '800', color: colors.text },
  breakLabel: { width: 90, fontSize: font.small, color: colors.text, textAlign: 'right', writingDirection: 'rtl' },

  skillsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },

  recHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: spacing.xl },
  recSub: { fontSize: font.small, color: colors.textMuted, lineHeight: 22, textAlign: 'right', marginBottom: spacing.md, writingDirection: 'rtl' },

  courseCard: { marginBottom: spacing.md },
  courseHead: { flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  courseBadges: { flexDirection: 'row-reverse', gap: 6 },
  tagBadge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: font.tiny, fontWeight: '800', writingDirection: 'rtl' },
  courseTitle: { flex: 1, fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  courseGap: { fontSize: font.tiny, color: colors.accentText, fontWeight: '700', textAlign: 'right', marginTop: 6, writingDirection: 'rtl' },
  courseMeta: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  courseBtn: { marginTop: spacing.md, paddingVertical: 11 },
});
