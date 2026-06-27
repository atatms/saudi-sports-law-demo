import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import TopBar from '../../components/TopBar';
import { colors, font, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const { L, isRTL, rtlText } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.includes('@') && password.length >= 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TopBar title={L('تسجيل الدخول', 'Sign in')} onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, rtlText()]}>
          {L('مرحباً بعودتك — سجّل الدخول لمتابعة طلباتك', 'Welcome back — sign in to track your applications')}
        </Text>

        <TextField
          label={L('البريد الإلكتروني', 'Email')}
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
        />
        <TextField
          label={L('كلمة المرور', 'Password')}
          icon="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        <Text style={[styles.forgot, { textAlign: isRTL ? 'left' : 'right' }]}>
          {L('نسيت كلمة المرور؟', 'Forgot password?')}
        </Text>

        <Button label={L('تسجيل الدخول', 'Sign in')} disabled={!canSubmit} onPress={() => signIn(email)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  subtitle: { fontSize: font.body, color: colors.textMuted, marginBottom: spacing.xl },
  forgot: { fontSize: font.small, color: colors.primary, fontWeight: '600', marginBottom: spacing.xl },
});
