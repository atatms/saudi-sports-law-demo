import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, font, radius, spacing } from '../theme';
import { useLang } from '../context/LanguageContext';

interface Props {
  fileName?: string;
  onPick: (name: string) => void;
  onClear: () => void;
}

/** CV file picker (PDF / Word) used in the onboarding form. */
export default function CvUpload({ fileName, onPick, onClear }: Props) {
  const { L, isRTL } = useLang();
  const row = isRTL ? 'row-reverse' : 'row';

  const pick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        onPick(res.assets[0].name);
      }
    } catch {
      // ignore picker errors (e.g. user dismissed)
    }
  };

  if (fileName) {
    return (
      <View style={[styles.chip, { flexDirection: row }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}</Text>
        </View>
        <Text style={[styles.name, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
          {fileName}
        </Text>
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.dropzone} activeOpacity={0.85} onPress={pick}>
      <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
      <Text style={styles.title}>{L('رفع السيرة الذاتية', 'Upload CV')}</Text>
      <Text style={styles.sub}>{L('PDF أو Word', 'PDF or Word')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primaryMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 4,
  },
  title: { fontSize: font.body, fontWeight: '800', color: colors.text, writingDirection: 'rtl' },
  sub: { fontSize: font.tiny, color: colors.textMuted, writingDirection: 'rtl' },
  chip: {
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  badge: { backgroundColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: colors.white, fontSize: font.tiny, fontWeight: '800' },
  name: { flex: 1, fontSize: font.small, fontWeight: '700', color: colors.text },
});
