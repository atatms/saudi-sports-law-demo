import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import Screen from '../components/Screen';
import Card from '../components/Card';
import ScoreRing from '../components/ScoreRing';
import SectionHeader from '../components/SectionHeader';
import JobCard from '../components/JobCard';
import { colors, font, radius, spacing, shadow } from '../theme';
import { homeStats, profile } from '../data/profile';
import { jobs } from '../data/jobs';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { L, isRTL } = useLang();
  const topMatches = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const firstName = (user?.name ?? '').split(' ')[0] || L('بك', 'there');
  const ta = isRTL ? 'right' : 'left';
  const row = isRTL ? 'row-reverse' : 'row';

  return (
    <Screen>
      {/* Greeting */}
      <View style={[styles.headerRow, { flexDirection: row }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { textAlign: ta }]}>{L(`أهلاً، ${firstName}`, `Hi, ${firstName}`)}</Text>
          <Text style={[styles.subGreeting, { textAlign: ta }]}>
            {user?.specialization
              ? L(`فرص مختارة لتخصص ${user.specialization}`, `Picks for your field: ${user.specialization}`)
              : L('مراجعتك الأسبوعية للوظائف جاهزة', 'Your weekly job review is ready')}
          </Text>
        </View>
        <View style={styles.dot}>
          <Ionicons name="person" size={20} color={colors.white} />
        </View>
      </View>

      {/* AI banner */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.banner, shadow.card, { flexDirection: row }]}
        onPress={() => navigation.navigate('Jobs')}
      >
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.white} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerText, { textAlign: ta }]}>
            {L('وجد الذكاء الاصطناعي', 'AI found')} <Text style={styles.bannerBold}>{L(`${homeStats.newMatches} وظائف متطابقة`, `${homeStats.newMatches} matching jobs`)}</Text>
          </Text>
          <Text style={[styles.bannerSub, { textAlign: ta }]}>{L('منذ زيارتك الأخيرة', 'since your last visit')}</Text>
        </View>
        <Ionicons name="sparkles" size={18} color={colors.white} />
      </TouchableOpacity>

      {/* Scores */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Ats')} style={styles.atsRing}>
            <ScoreRing score={homeStats.atsScore} size={70} strokeWidth={6} />
            <Text style={styles.ringCaption}>{L('نقاط ATS', 'ATS score')}</Text>
          </TouchableOpacity>
          <View style={styles.scoreText}>
            <Text style={styles.scoreLabel}>{L('نقاط السيرة الذاتية', 'Resume score')}</Text>
            <Text style={styles.bigScore}>{homeStats.resumeScore}</Text>
            <Text style={[styles.scoreHint, { textAlign: ta }]}>
              {L(`أفضل من ${homeStats.betterThanApplicants} من المتقدمين`, `Better than ${homeStats.betterThanApplicants} applicants`)}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ResumeAnalyzer')} style={styles.scorePill}>
              <Text style={styles.scorePillText}>{L(`+${homeStats.pointsToReach85} نقاط هذا الأسبوع`, `+${homeStats.pointsToReach85} points this week`)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Quick stats */}
      <View style={[styles.statsRow, { flexDirection: row }]}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{homeStats.applications}</Text>
          <Text style={styles.statLabel}>{L('الطلبات', 'Applications')}</Text>
          <Text style={styles.statSub}>{L('4 نشطة هذا الشهر', '4 active this month')}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{homeStats.interviews}</Text>
          <Text style={styles.statLabel}>{L('المقابلات', 'Interviews')}</Text>
          <Text style={styles.statSub}>{L('التالية الأربعاء 10ص', 'Next: Wed 10 AM')}</Text>
        </Card>
      </View>

      {/* Portfolio nudge */}
      {!profile.portfolioLinked && (
        <TouchableOpacity activeOpacity={0.9} style={[styles.portfolio, { flexDirection: row }]}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.accentText} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.portfolioTitle, { textAlign: ta }]}>{L('أضف رابط معرض أعمالك', 'Add your portfolio link')}</Text>
            <Text style={[styles.portfolioSub, { textAlign: ta }]}>{L('احصل على 3x مشاهدات أكثر من أصحاب العمل', 'Get 3× more views from employers')}</Text>
          </View>
          <Ionicons name="link" size={18} color={colors.accentText} />
        </TouchableOpacity>
      )}

      {/* Best matches */}
      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader
          title={L('أفضل التطابقات لك', 'Top matches for you')}
          actionLabel={L('عرض الكل', 'See all')}
          onAction={() => navigation.navigate('Jobs')}
        />
        {topMatches.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            onApply={() => navigation.navigate('JobDetails', { jobId: job.id })}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  greeting: { fontSize: font.h1, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  subGreeting: { fontSize: font.small, color: colors.textMuted, textAlign: 'right', marginTop: 4, writingDirection: 'rtl' },
  dot: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerText: { color: colors.white, fontSize: font.body, textAlign: 'right', writingDirection: 'rtl' },
  bannerBold: { fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: font.small, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },

  scoreCard: { marginTop: spacing.lg, backgroundColor: colors.cardAlt },
  scoreRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  atsRing: { alignItems: 'center', marginLeft: spacing.lg },
  ringCaption: { fontSize: font.tiny, color: colors.textMuted, marginTop: 4 },
  scoreText: { flex: 1, alignItems: 'flex-end' },
  scoreLabel: { fontSize: font.small, color: colors.textMuted, writingDirection: 'rtl' },
  bigScore: { fontSize: 48, fontWeight: '800', color: colors.text, lineHeight: 54 },
  scoreHint: { fontSize: font.small, color: colors.primary, fontWeight: '600', writingDirection: 'rtl' },
  scorePill: { backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6, marginTop: spacing.sm },
  scorePillText: { color: colors.primary, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },

  statsRow: { flexDirection: 'row-reverse', gap: spacing.md, marginTop: spacing.md },
  statCard: { flex: 1, alignItems: 'flex-end' },
  statValue: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: font.small, color: colors.textMuted, marginTop: 2, writingDirection: 'rtl' },
  statSub: { fontSize: font.tiny, color: colors.textFaint, marginTop: 2, textAlign: 'right', writingDirection: 'rtl' },

  portfolio: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  portfolioTitle: { color: colors.accentText, fontWeight: '800', fontSize: font.body, textAlign: 'right', writingDirection: 'rtl' },
  portfolioSub: { color: colors.accentText, fontSize: font.small, textAlign: 'right', marginTop: 2, opacity: 0.85, writingDirection: 'rtl' },
});
