import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '../theme';

interface Props {
  title: string;
  onBack?: () => void;
  rightLabel?: string;
  onRight?: () => void;
}

/** RTL top bar: title on the right, back chevron points right (toward start). */
export default function TopBar({ title, onBack, rightLabel, onRight }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        {rightLabel ? (
          <TouchableOpacity onPress={onRight}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : null}
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  title: { fontSize: font.h2, fontWeight: '800', color: colors.text, writingDirection: 'rtl', flex: 1, textAlign: 'right' },
  right: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm },
  rightLabel: { fontSize: font.small, color: colors.primary, fontWeight: '700' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
