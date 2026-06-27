import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import Card from '../components/Card';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';
import { colors, font, radius, spacing } from '../theme';
import { profile, resumeScore, resumeBreakdown, resumeSuggestions } from '../data/profile';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResumeAnalyzer'>;

function barColor(score: number) {
  if (score >= 80) return colors.primary;
  if (score >= 60) return colors.gold;
  return colors.danger;
}

export default function ResumeAnalyzerScreen({ navigation }: Props) {
  const { L, isRTL } = useLang();
  const ta = isRTL ? 'right' : 'left';
  const row = isRTL ? 'row-reverse' : 'row';
  return (
    <Screen>
      <TopBar title={L('محلل السيرة الذاتية', 'CV analyzer')} onBack={() => navigation.goBack()} rightLabel={L('تصدير', 'Export')} />

      {/* File chip */}
      <Card flat style={styles.fileCard}>
        <View style={styles.fileBadge}>
          <Text style={styles.fileBadgeText}>PDF</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fileName}>{profile.resumeFile}</Text>
          <Text style={styles.fileMeta}>{profile.resumeMeta}</Text>
        </View>
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
      </Card>

      {/* Score */}
      <View style={styles.scoreWrap}>
        <ScoreRing score={resumeScore} size={120} strokeWidth={9} color={colors.gold} />
        <View style={styles.aboveAvg}>
          <Text style={styles.aboveAvgText}>{L('فوق المتوسط', 'Above average')}</Text>
        </View>
        <Text style={styles.scoreSub}>{L('أفضل من 161 في مجالك', 'Better than 161 in your field')}</Text>
      </View>

      {/* Breakdown */}
      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('تفاصيل النتيجة', 'Score breakdown')}</Text>
      <Card flat style={{ marginTop: spacing.sm }}>
        {resumeBreakdown.map((b) => (
          <View key={b.label} style={[styles.breakRow, { flexDirection: row }]}>
            <Text style={styles.breakScore}>{b.score}%</Text>
            <View style={styles.breakBar}>
              <ProgressBar value={b.score} color={barColor(b.score)} height={7} />
            </View>
            <Text style={[styles.breakLabel, { textAlign: ta }]}>{b.label}</Text>
          </View>
        ))}
      </Card>

      {/* AI suggestions */}
      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('اقتراحات الذكاء الاصطناعي', 'AI suggestions')}</Text>
      {resumeSuggestions.map((s, i) => (
        <Card key={i} style={styles.suggestionCard}>
          <View style={[styles.suggestionTop, { flexDirection: row }]}>
            <Ionicons
              name={s.type === 'positive' ? 'checkmark-circle' : 'alert-circle'}
              size={20}
              color={s.type === 'positive' ? colors.primary : colors.gold}
            />
            <Text style={[styles.suggestionTitle, { textAlign: ta }]}>{s.title}</Text>
          </View>
          <Text style={[styles.suggestionDetail, { textAlign: ta }]}>{s.detail}</Text>
          {s.action ? (
            <TouchableOpacity style={styles.aiActionBtn} activeOpacity={0.85}>
              <Ionicons name="sparkles" size={14} color={colors.white} />
              <Text style={styles.aiActionText}>{s.action}</Text>
            </TouchableOpacity>
          ) : null}
        </Card>
      ))}

      <TouchableOpacity style={styles.reanalyze} activeOpacity={0.85}>
        <Text style={styles.reanalyzeText}>{L('إعادة التحليل بنسخة جديدة', 'Re-analyze a new version')}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fileCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md, backgroundColor: colors.cardAlt },
  fileBadge: { backgroundColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  fileBadgeText: { color: colors.white, fontSize: font.tiny, fontWeight: '800' },
  fileName: { fontSize: font.body, fontWeight: '700', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  fileMeta: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },

  scoreWrap: { alignItems: 'center', marginTop: spacing.xl },
  aboveAvg: { backgroundColor: colors.goldSoft, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: 6, marginTop: spacing.md },
  aboveAvgText: { color: colors.gold, fontWeight: '800', fontSize: font.small, writingDirection: 'rtl' },
  scoreSub: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.sm, writingDirection: 'rtl' },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, writingDirection: 'rtl' },
  breakRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  breakScore: { width: 44, fontSize: font.small, fontWeight: '800', color: colors.text, textAlign: 'left' },
  breakBar: { flex: 1 },
  breakLabel: { width: 90, fontSize: font.small, color: colors.text, textAlign: 'right', writingDirection: 'rtl' },

  suggestionCard: { marginTop: spacing.md },
  suggestionTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  suggestionTitle: { flex: 1, fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  suggestionDetail: { fontSize: font.small, color: colors.textMuted, lineHeight: 22, textAlign: 'right', marginTop: spacing.sm, writingDirection: 'rtl' },
  aiActionBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, alignSelf: 'flex-end', backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 9, marginTop: spacing.md },
  aiActionText: { color: colors.white, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },

  reanalyze: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: spacing.xl },
  reanalyzeText: { color: colors.white, fontWeight: '800', fontSize: font.body, writingDirection: 'rtl' },
});
