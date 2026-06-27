import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import TopBar from '../../components/TopBar';
import RegionDropdown from '../../components/RegionDropdown';
import { colors, font, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { ALL_REGIONS_ID } from '../../data/regions';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [regionId, setRegionId] = useState(ALL_REGIONS_ID);

  const canSubmit = name.trim().length > 1 && email.includes('@') && password.length >= 4;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TopBar title="إنشاء حساب جديد" onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>أنشئ حسابك لتبدأ رحلة البحث عن وظيفتك القادمة</Text>

        <TextField label="الاسم الكامل" icon="person-outline" value={name} onChangeText={setName} placeholder="أحمد الراشدي" />
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
          label="رقم الجوال"
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="05XXXXXXXX"
        />

        <Text style={styles.fieldLabel}>المنطقة الإدارية</Text>
        <View style={styles.regionWrap}>
          <RegionDropdown selectedId={regionId} onSelect={setRegionId} />
        </View>

        <TextField
          label="كلمة المرور"
          icon="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="٤ أحرف على الأقل"
        />

        <Button
          label="إنشاء الحساب"
          disabled={!canSubmit}
          onPress={() => signUp({ name, email, regionId })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  subtitle: { fontSize: font.body, color: colors.textMuted, textAlign: 'right', marginBottom: spacing.xl, writingDirection: 'rtl' },
  fieldLabel: { fontSize: font.small, fontWeight: '700', color: colors.text, textAlign: 'right', marginBottom: 6, writingDirection: 'rtl' },
  regionWrap: { alignItems: 'flex-end', marginBottom: spacing.lg },
});
