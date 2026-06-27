import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import ScoreRing from '../components/ScoreRing';
import TopBar from '../components/TopBar';
import { colors, font, radius, spacing } from '../theme';
import { atsScore, atsPlatforms, atsChecks, atsMissingKeywords } from '../data/profile';
import { AtsCheck } from '../data/types';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Ats'>;

const CHECK_META: Record<AtsCheck['status'], { icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap; color: string }> = {
  pass: { icon: 'checkmark-circle', color: colors.primary },
  warn: { icon: 'alert-circle', color: colors.gold },
  fail: { icon: 'close-circle', color: colors.danger },
};

export default function AtsScreen({ navigation }: Props) {
  const { L, isRTL } = useLang();
  const ta = isRTL ? 'right' : 'left';
  const row = isRTL ? 'row-reverse' : 'row';
  return (
    <Screen>
      <TopBar title={L('توافق ATS', 'ATS compatibility')} onBack={() => navigation.goBack()} rightLabel={L('التقرير', 'Report')} />

      {/* Score */}
      <View style={styles.scoreWrap}>
        <ScoreRing score={atsScore} size={120} strokeWidth={9} color={colors.primary} />
        <View style={[styles.passBadge, { flexDirection: row }]}>
          <Ionicons name="trophy" size={14} color={colors.primary} />
          <Text style={styles.passText}>{L('إيجابي للنجاح', 'Likely to pass')}</Text>
        </View>
        <Text style={styles.scoreSub}>{L('أصلح تحذيرين للوصول إلى 90+', 'Fix 2 warnings to reach 90+')}</Text>
      </View>

      {/* Platforms */}
      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('حسب منصة ATS', 'By ATS platform')}</Text>
      <View style={[styles.platformGrid, { flexDirection: row }]}>
        {atsPlatforms.map((p) => (
          <View key={p.name} style={[styles.platformTile, { flexDirection: row }]}>
            <Text style={styles.platformName}>{p.name}</Text>
            <Text style={[styles.platformScore, { color: p.score >= 85 ? colors.primary : colors.gold }]}>{p.score}%</Text>
          </View>
        ))}
      </View>

      {/* Checks */}
      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('الفحوصات التقنية', 'Technical checks')}</Text>
      {atsChecks.map((c, i) => {
        const meta = CHECK_META[c.status];
        return (
          <Card key={i} style={styles.checkCard}>
            <View style={[styles.checkTop, { flexDirection: row }]}>
              <Ionicons name={meta.icon} size={20} color={meta.color} />
              <Text style={[styles.checkTitle, { textAlign: ta }]}>{c.title}</Text>
            </View>
            <Text style={[styles.checkDetail, { textAlign: ta }]}>{c.detail}</Text>
            {c.action ? (
              <TouchableOpacity style={styles.checkAction} activeOpacity={0.85}>
                <Text style={styles.checkActionText}>{c.action}</Text>
              </TouchableOpacity>
            ) : null}
          </Card>
        );
      })}

      {/* Missing keywords */}
      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('الكلمات المفتاحية الناقصة', 'Missing keywords')}</Text>
      <Card flat style={{ marginTop: spacing.sm }}>
        <View style={[styles.keywordsWrap, { flexDirection: row }]}>
          {atsMissingKeywords.map((k) => (
            <Chip key={k} label={k} variant="accent" />
          ))}
        </View>
      </Card>

      <TouchableOpacity style={[styles.insertBtn, { flexDirection: row }]} activeOpacity={0.85}>
        <Ionicons name="sparkles" size={15} color={colors.white} />
        <Text style={styles.insertText}>{L('إدراج الكلمات المفتاحية تلقائياً في السيرة الذاتية', 'Auto-insert keywords into the CV')}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scoreWrap: { alignItems: 'center', marginTop: spacing.lg },
  passBadge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: 6, marginTop: spacing.md },
  passText: { color: colors.primary, fontWeight: '800', fontSize: font.small, writingDirection: 'rtl' },
  scoreSub: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.sm, writingDirection: 'rtl' },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, marginBottom: spacing.sm, writingDirection: 'rtl' },

  platformGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing.sm },
  platformTile: { width: '48%', backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  platformName: { fontSize: font.small, color: colors.text, fontWeight: '600', writingDirection: 'rtl' },
  platformScore: { fontSize: font.body, fontWeight: '800' },

  checkCard: { marginBottom: spacing.md },
  checkTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  checkTitle: { flex: 1, fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  checkDetail: { fontSize: font.small, color: colors.textMuted, lineHeight: 21, textAlign: 'right', marginTop: spacing.sm, writingDirection: 'rtl' },
  checkAction: { alignSelf: 'flex-end', backgroundColor: colors.primaryLight, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 8, marginTop: spacing.md },
  checkActionText: { color: colors.primary, fontWeight: '700', fontSize: font.small, writingDirection: 'rtl' },

  keywordsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },

  insertBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, marginTop: spacing.xl },
  insertText: { color: colors.white, fontWeight: '700', fontSize: font.small, textAlign: 'center', writingDirection: 'rtl' },
});
