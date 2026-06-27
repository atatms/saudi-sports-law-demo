import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import TopBar from '../../components/TopBar';
import RegionDropdown from '../../components/RegionDropdown';
import SelectField from '../../components/SelectField';
import { colors, font, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { ALL_REGIONS_ID } from '../../data/regions';
import { educationLevels } from '../../data/education';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const { L, isRTL, rtlText } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [regionId, setRegionId] = useState(ALL_REGIONS_ID);
  const [educationLevelId, setEducation] = useState<string | undefined>(undefined);
  const [specialization, setSpecialization] = useState('');

  const canSubmit = name.trim().length > 1 && email.includes('@') && password.length >= 4;

  const eduOptions = educationLevels.map((e) => ({ id: e.id, label: L(e.ar, e.en) }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TopBar title={L('إنشاء حساب جديد', 'Create account')} onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, rtlText()]}>
          {L('أنشئ حسابك لتبدأ رحلة البحث عن وظيفتك القادمة', 'Create your account to start your job search')}
        </Text>

        <TextField label={L('الاسم الكامل', 'Full name')} icon="person-outline" value={name} onChangeText={setName} placeholder={L('مثال: علي العتيبي', 'e.g. Ali Alotaibi')} />
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
          label={L('رقم الجوال', 'Mobile number')}
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="05XXXXXXXX"
        />

        <Text style={[styles.fieldLabel, rtlText()]}>{L('المنطقة الإدارية', 'Administrative region')}</Text>
        <View style={[styles.regionWrap, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <RegionDropdown selectedId={regionId} onSelect={setRegionId} />
        </View>

        <Text style={[styles.fieldLabel, rtlText()]}>{L('المؤهل العلمي', 'Education level')}</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <SelectField
            options={eduOptions}
            selectedId={educationLevelId}
            isRTL={isRTL}
            icon="school-outline"
            placeholder={L('اختر المرحلة (المتوسطة - دكتوراه)', 'Select level (Intermediate – PhD)')}
            title={L('المؤهل العلمي', 'Education level')}
            onSelect={setEducation}
          />
        </View>

        <TextField
          label={L('التخصص', 'Field of study / specialization')}
          icon="ribbon-outline"
          value={specialization}
          onChangeText={setSpecialization}
          placeholder={L('مثال: علوم الحاسب، إدارة أعمال', 'e.g. Computer Science, Business')}
        />

        <TextField
          label={L('كلمة المرور', 'Password')}
          icon="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder={L('٤ أحرف على الأقل', 'At least 4 characters')}
        />

        <Button
          label={L('إنشاء الحساب', 'Create account')}
          disabled={!canSubmit}
          onPress={() => signUp({ name, email, phone, regionId, educationLevelId, specialization })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  subtitle: { fontSize: font.body, color: colors.textMuted, marginBottom: spacing.xl },
  fieldLabel: { fontSize: font.small, fontWeight: '700', color: colors.text, marginBottom: 6 },
  regionWrap: { marginBottom: spacing.lg },
});
