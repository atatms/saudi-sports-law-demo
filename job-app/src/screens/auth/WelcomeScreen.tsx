import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/Button';
import { colors, font, radius, spacing } from '../../theme';
import { jobPlatforms } from '../../data/platforms';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { signInWithPlatform } = useAuth();
  const featured = jobPlatforms.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="briefcase" size={40} color={colors.white} />
        </View>
        <Text style={styles.brand}>وظيفة</Text>
        <Text style={styles.tagline}>
          وظيفتك القادمة في مكان واحد — يجمع التطبيق إعلانات التوظيف من جميع المنصات،
          ويحلّل سيرتك الذاتية، ويرشدك لأفضل الدورات.
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.connectTitle}>سجّل الدخول عبر منصات التوظيف</Text>
        <View style={styles.socialRow}>
          {featured.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.social, { borderColor: p.color }]}
              activeOpacity={0.85}
              onPress={() => signInWithPlatform(p.id)}
            >
              <View style={[styles.socialBadge, { backgroundColor: p.color }]}>
                <Text style={styles.socialBadgeText}>{p.initials}</Text>
              </View>
              <Text style={styles.socialName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>أو</Text>
          <View style={styles.line} />
        </View>

        <Button label="إنشاء حساب جديد" onPress={() => navigation.navigate('Register')} />
        <Button
          label="لديّ حساب — تسجيل الدخول"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.terms}>
          بالمتابعة فإنك توافق على الشروط وسياسة الخصوصية
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
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
  brand: { fontSize: 40, fontWeight: '900', color: colors.white, marginTop: spacing.lg, writingDirection: 'rtl' },
  tagline: {
    fontSize: font.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.md,
    writingDirection: 'rtl',
  },
  body: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
  },
  connectTitle: { fontSize: font.small, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md, writingDirection: 'rtl' },
  socialRow: { flexDirection: 'row-reverse', gap: spacing.sm },
  social: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  socialBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  socialBadgeText: { color: colors.white, fontWeight: '800', fontSize: font.tiny },
  socialName: { fontSize: font.tiny, color: colors.text, fontWeight: '600', writingDirection: 'rtl' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textMuted, fontSize: font.small },

  terms: { fontSize: font.tiny, color: colors.textFaint, textAlign: 'center', marginTop: spacing.lg, writingDirection: 'rtl' },
});
