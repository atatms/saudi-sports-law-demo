import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import TopBar from '../../components/TopBar';
import RegionDropdown from '../../components/RegionDropdown';
import SelectField from '../../components/SelectField';
import CvUpload from '../../components/CvUpload';
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
  const [years, setYears] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [cvFileName, setCvFileName] = useState<string | undefined>(undefined);

  const canSubmit =
    name.trim().length > 1 && email.includes('@') && password.length >= 4 && !!educationLevelId;

  const eduOptions = educationLevels.map((e) => ({ id: e.id, label: L(e.ar, e.en) }));

  const save = () => {
    signUp({
      name,
      email,
      phone,
      regionId,
      educationLevelId,
      specialization,
      experienceYears: years ? Number(years) : undefined,
      experienceText,
      cvFileName,
    });
  };

  const Section = ({ title }: { title: string }) => (
    <Text style={[styles.section, rtlText()]}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TopBar title={L('إنشاء ملفك المهني', 'Build your profile')} onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.intro, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={[styles.introText, rtlText()]}>
            {L(
              'أدخل بياناتك مرة واحدة، ونحفظها في ملفك، ثم نعرض لك الوظائف المناسبة لمؤهلك وخبرتك من جميع المنصات.',
              'Enter your data once, we save it to your profile, then show jobs matching your degree and experience from all platforms.',
            )}
          </Text>
        </View>

        {/* Personal */}
        <Section title={L('البيانات الشخصية', 'Personal details')} />
        <TextField label={L('الاسم الكامل', 'Full name')} icon="person-outline" value={name} onChangeText={setName} placeholder={L('مثال: علي العتيبي', 'e.g. Ali Alotaibi')} />
        <TextField label={L('البريد الإلكتروني', 'Email')} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} placeholder="name@example.com" />
        <TextField label={L('رقم الجوال', 'Mobile number')} icon="call-outline" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholder="05XXXXXXXX" />

        <Text style={[styles.fieldLabel, rtlText()]}>{L('المنطقة الإدارية', 'Administrative region')}</Text>
        <View style={[styles.regionWrap, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <RegionDropdown selectedId={regionId} onSelect={setRegionId} />
        </View>

        {/* Qualifications */}
        <Section title={L('المؤهلات', 'Qualifications')} />
        <Text style={[styles.fieldLabel, rtlText()]}>{L('الدرجة العلمية', 'Education level')}</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <SelectField
            options={eduOptions}
            selectedId={educationLevelId}
            isRTL={isRTL}
            icon="school-outline"
            placeholder={L('اختر الدرجة (المتوسطة - دكتوراه)', 'Select level (Intermediate – PhD)')}
            title={L('الدرجة العلمية', 'Education level')}
            onSelect={setEducation}
          />
        </View>
        <TextField label={L('التخصص', 'Field of study')} icon="ribbon-outline" value={specialization} onChangeText={setSpecialization} placeholder={L('مثال: علوم الحاسب', 'e.g. Computer Science')} />

        {/* Experience */}
        <Section title={L('الخبرات', 'Experience')} />
        <TextField label={L('سنوات الخبرة', 'Years of experience')} icon="time-outline" keyboardType="number-pad" value={years} onChangeText={setYears} placeholder={L('مثال: 5', 'e.g. 5')} />
        <TextField
          label={L('الخبرات والمهارات', 'Experience & skills')}
          icon="briefcase-outline"
          value={experienceText}
          onChangeText={setExperienceText}
          multiline
          numberOfLines={3}
          placeholder={L('مثال: إدارة منتجات، تحليل بيانات، قيادة فرق...', 'e.g. Product management, data analysis, team leadership...')}
        />

        {/* CV */}
        <Section title={L('السيرة الذاتية', 'Resume / CV')} />
        <View style={{ marginBottom: spacing.lg }}>
          <CvUpload fileName={cvFileName} onPick={setCvFileName} onClear={() => setCvFileName(undefined)} />
        </View>

        {/* Password */}
        <Section title={L('الأمان', 'Security')} />
        <TextField label={L('كلمة المرور', 'Password')} icon="lock-closed-outline" secureTextEntry value={password} onChangeText={setPassword} placeholder={L('٤ أحرف على الأقل', 'At least 4 characters')} />

        <Button label={L('حفظ ومتابعة', 'Save & continue')} disabled={!canSubmit} onPress={save} icon="save-outline" />
        <Text style={[styles.hint, rtlText()]}>
          {L('عند الحفظ تُعالَج بياناتك وتُسحب الوظائف المناسبة من المنصات.', 'On save, your data is processed and matching jobs are pulled from the platforms.')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  intro: { alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primaryLight, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg },
  introText: { flex: 1, fontSize: font.small, color: colors.primaryDark, lineHeight: 21 },
  section: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginTop: spacing.md, marginBottom: spacing.md },
  fieldLabel: { fontSize: font.small, fontWeight: '700', color: colors.text, marginBottom: 6 },
  regionWrap: { marginBottom: spacing.lg },
  hint: { fontSize: font.tiny, color: colors.textMuted, marginTop: spacing.md, lineHeight: 18 },
});
