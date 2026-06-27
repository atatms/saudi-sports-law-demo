import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, spacing } from '../theme';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** RTL section heading with optional trailing action ("عرض الكل"). */
export default function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text, writingDirection: 'rtl' },
  action: { fontSize: font.small, color: colors.textMuted, fontWeight: '600' },
});
