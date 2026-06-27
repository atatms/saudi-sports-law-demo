import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import TopBar from '../components/TopBar';
import { colors, font, radius, spacing } from '../theme';
import { jobPlatforms } from '../data/platforms';
import { jobs } from '../data/jobs';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectPlatforms'>;

export default function ConnectPlatformsScreen({ navigation }: Props) {
  const { connectedPlatformIds, togglePlatform } = useAuth();
  const { L, isRTL } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';
  const ta = isRTL ? 'right' : 'left';

  const countFor = (id: string) => jobs.filter((j) => j.sourceId === id).length;

  return (
    <Screen>
      <TopBar title={L('ربط منصات التوظيف', 'Link job platforms')} onBack={() => navigation.goBack()} />

      <Card style={[styles.infoCard, { flexDirection: row }]}>
        <Ionicons name="git-network-outline" size={22} color={colors.primary} />
        <Text style={[styles.infoText, { textAlign: ta }]}>
          {L(
            'اربط حسابك في كل منصة مرة واحدة فقط، ويسحب التطبيق إعلاناتها تلقائياً إلى مكان واحد — دون الحاجة للتسجيل في كل منصة على حدة. ثم تُرتَّب الوظائف حسب تطابقها مع مؤهلك وتخصصك وسيرتك الذاتية.',
            'Link each platform once and the app automatically pulls its listings into one place — no need to sign up on each platform separately. Jobs are then ranked by how well they match your degree, field, and CV.',
          )}
        </Text>
      </Card>

      <Text style={[styles.sectionTitle, { textAlign: ta }]}>{L('المنصات المتاحة', 'Available platforms')}</Text>

      {jobPlatforms.map((p) => {
        const connected = connectedPlatformIds.includes(p.id);
        return (
          <Card key={p.id} style={[styles.row, { flexDirection: row }]}>
            <View style={[styles.badge, { backgroundColor: p.color }]}>
              <Text style={styles.badgeText}>{p.initials}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: spacing.md }}>
              <Text style={[styles.name, { textAlign: ta }]}>{L(p.name, p.nameEn)}</Text>
              <Text style={[styles.desc, { textAlign: ta }]} numberOfLines={1}>{p.description}</Text>
              <Text style={[styles.count, { textAlign: ta }]}>
                {countFor(p.id)} {L('وظيفة متاحة', 'jobs available')}
              </Text>
            </View>
            <Button
              label={connected ? L('مرتبط', 'Linked') : L('ربط', 'Link')}
              variant={connected ? 'outline' : 'primary'}
              icon={connected ? 'checkmark' : 'add'}
              onPress={() => togglePlatform(p.id)}
              style={styles.connectBtn}
            />
          </Card>
        );
      })}

      <Text style={styles.footer}>
        {L('المنصات المرتبطة', 'Linked platforms')}: {connectedPlatformIds.length} / {jobPlatforms.length}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.primaryLight, marginTop: spacing.sm },
  infoText: { flex: 1, fontSize: font.small, color: colors.primaryDark, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },

  sectionTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right', marginTop: spacing.xl, marginBottom: spacing.sm, writingDirection: 'rtl' },

  row: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: spacing.md },
  badge: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.white, fontWeight: '800', fontSize: font.small },
  name: { fontSize: font.body, fontWeight: '800', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  desc: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right', marginTop: 2, writingDirection: 'rtl' },
  count: { fontSize: font.tiny, color: colors.primary, fontWeight: '700', textAlign: 'right', marginTop: 3, writingDirection: 'rtl' },
  connectBtn: { paddingVertical: 9, paddingHorizontal: spacing.lg, minWidth: 84 },

  footer: { fontSize: font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, writingDirection: 'rtl' },
});
