import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import TopBar from '../../components/TopBar';
import { colors, font, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('ahmad@example.com');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TopBar title="تسجيل الدخول" onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>مرحباً بعودتك — سجّل الدخول لمتابعة طلباتك</Text>

        <TextField
          label="البريد الإلكتروني"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
        />
        <TextField
          label="كلمة المرور"
          icon="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>

        <Button label="تسجيل الدخول" onPress={() => signIn(email)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  subtitle: { fontSize: font.body, color: colors.textMuted, textAlign: 'right', marginBottom: spacing.xl, writingDirection: 'rtl' },
  forgot: { fontSize: font.small, color: colors.primary, fontWeight: '600', textAlign: 'left', marginBottom: spacing.xl, writingDirection: 'rtl' },
});
