import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  value: string | number;
  label: string;
  sub?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  valueColor?: string;
}

export default function StatTile({ value, label, sub, icon, iconColor, valueColor }: Props) {
  return (
    <View style={styles.tile}>
      {icon ? (
        <Ionicons name={icon} size={18} color={iconColor ?? colors.primary} style={{ marginBottom: 6 }} />
      ) : null}
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  value: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  label: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2, textAlign: 'center', writingDirection: 'rtl' },
  sub: { fontSize: font.tiny, color: colors.textFaint, marginTop: 2 },
});
