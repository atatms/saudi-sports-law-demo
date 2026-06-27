import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function TextField({ label, icon, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} /> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textFaint}
          textAlign="right"
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { fontSize: font.small, fontWeight: '700', color: colors.text, textAlign: 'right', marginBottom: 6, writingDirection: 'rtl' },
  box: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  input: { flex: 1, fontSize: font.body, color: colors.text, writingDirection: 'rtl' },
});
