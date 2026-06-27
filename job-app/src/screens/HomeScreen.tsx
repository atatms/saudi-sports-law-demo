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
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const topMatches = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

  return (
    <Screen>
      {/* Greeting */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>صباح الخير، أحمد</Text>
          <Text style={styles.subGreeting}>مراجعتك الأسبوعية للوظائف جاهزة</Text>
        </View>
        <View style={styles.dot}>
          <Ionicons name="person" size={20} color={colors.white} />
        </View>
      </View>

      {/* AI banner */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.banner, shadow.card]}
        onPress={() => navigation.navigate('Jobs')}
      >
        <Ionicons name="chevron-back" size={20} color={colors.white} />
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerText}>
            وجد الذكاء الاصطناعي <Text style={styles.bannerBold}>{homeStats.newMatches} وظائف متطابقة</Text>
          </Text>
          <Text style={styles.bannerSub}>منذ زيارتك الأخيرة</Text>
        </View>
        <Ionicons name="sparkles" size={18} color={colors.white} />
      </TouchableOpacity>

      {/* Scores */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Ats')} style={styles.atsRing}>
            <ScoreRing score={homeStats.atsScore} size={70} strokeWidth={6} />
            <Text style={styles.ringCaption}>نقاط ATS</Text>
          </TouchableOpacity>
          <View style={styles.scoreText}>
            <Text style={styles.scoreLabel}>نقاط السيرة الذاتية</Text>
            <Text style={styles.bigScore}>{homeStats.resumeScore}</Text>
            <Text style={styles.scoreHint}>
              أفضل من {homeStats.betterThanApplicants} من المتقدمين
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ResumeAnalyzer')} style={styles.scorePill}>
              <Text style={styles.scorePillText}>+{homeStats.pointsToReach85} نقاط هذا الأسبوع</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{homeStats.applications}</Text>
          <Text style={styles.statLabel}>الطلبات</Text>
          <Text style={styles.statSub}>4 نشطة هذا الشهر</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{homeStats.interviews}</Text>
          <Text style={styles.statLabel}>المقابلات</Text>
          <Text style={styles.statSub}>التالية الأربعاء 10 صباحاً</Text>
        </Card>
      </View>

      {/* Portfolio nudge */}
      {!profile.portfolioLinked && (
        <TouchableOpacity activeOpacity={0.9} style={styles.portfolio}>
          <Ionicons name="chevron-back" size={18} color={colors.accentText} />
          <View style={{ flex: 1 }}>
            <Text style={styles.portfolioTitle}>أضف رابط معرض أعمالك</Text>
            <Text style={styles.portfolioSub}>احصل على 3x مشاهدات أكثر من أصحاب العمل</Text>
          </View>
          <Ionicons name="link" size={18} color={colors.accentText} />
        </TouchableOpacity>
      )}

      {/* Best matches */}
      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader
          title="أفضل التطابقات لك"
          actionLabel="عرض الكل 24"
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
