import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/Button';
import { colors, font, radius, spacing } from '../../theme';
import { jobPlatforms } from '../../data/platforms';
import { useLang } from '../../context/LanguageContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { L, isRTL, toggle, lang } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';

  const features = [
    { icon: 'git-network-outline' as const, text: L('يجمع وظائف لينكدإن وبيت.كوم وطاقات في مكان واحد', 'Aggregates LinkedIn, Bayt & Taqat jobs in one place') },
    { icon: 'document-text-outline' as const, text: L('يحلّل سيرتك الذاتية ويقيس توافقها', 'Analyzes your CV and scores its fit') },
    { icon: 'school-outline' as const, text: L('يقترح ما يناسب مؤهلك وتخصصك من وظائف ودورات', 'Recommends jobs & courses for your degree and field') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Language switch */}
      <View style={[styles.langRow, { flexDirection: row }]}>
        <Button
          label={lang === 'ar' ? 'English' : 'العربية'}
          variant="ghost"
          icon="globe-outline"
          onPress={toggle}
          style={styles.langBtn}
        />
      </View>

      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="briefcase" size={40} color={colors.white} />
        </View>
        <Text style={styles.brand}>{L('وظيفة', 'Wadhefa')}</Text>
        <Text style={styles.tagline}>
          {L(
            'وظيفتك القادمة في مكان واحد — تطبيق يربط منصات التوظيف، ويحلّل سيرتك، ويرشدك لأفضل الفرص والدورات.',
            'Your next job in one place — links job platforms, analyzes your CV, and guides you to the best opportunities and courses.',
          )}
        </Text>

        <View style={styles.platforms}>
          {jobPlatforms.slice(0, 6).map((p) => (
            <View key={p.id} style={[styles.pBadge, { backgroundColor: p.color }]}>
              <Text style={styles.pBadgeText}>{p.initials}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        {features.map((f, i) => (
          <View key={i} style={[styles.feature, { flexDirection: row }]}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={18} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { textAlign: isRTL ? 'right' : 'left' }]}>{f.text}</Text>
          </View>
        ))}

        <Button label={L('إنشاء حساب جديد', 'Create account')} onPress={() => navigation.navigate('Register')} style={{ marginTop: spacing.md }} />
        <Button
          label={L('لديّ حساب — تسجيل الدخول', 'I have an account — Sign in')}
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.note}>
          {L('تربط منصات التوظيف بعد الدخول من داخل حسابك.', 'Link your job platforms after signing in, from inside your account.')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  langRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  langBtn: { paddingVertical: 6, paddingHorizontal: 4 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  brand: { fontSize: 40, fontWeight: '900', color: colors.white, marginTop: spacing.lg },
  tagline: { fontSize: font.body, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 24, marginTop: spacing.md },
  platforms: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  pBadge: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  pBadgeText: { color: colors.white, fontWeight: '800', fontSize: font.tiny },

  body: { backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl },
  feature: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  featureIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1, fontSize: font.small, color: colors.text, fontWeight: '600' },
  note: { fontSize: font.tiny, color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg },
});
