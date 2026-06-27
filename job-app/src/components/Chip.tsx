import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font, spacing } from '../theme';

interface Props {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  variant?: 'default' | 'accent' | 'outline' | 'solid';
  onPress?: () => void;
  style?: ViewStyle;
}

/** Small rounded pill: filters, tags, skills. */
export default function Chip({ label, icon, active, variant = 'default', onPress, style }: Props) {
  const Comp: any = onPress ? TouchableOpacity : View;

  const palettes: Record<string, { bg: string; fg: string; border?: string }> = {
    default: { bg: colors.chipBg, fg: colors.text },
    accent: { bg: colors.accentSoft, fg: colors.accentText },
    outline: { bg: 'transparent', fg: colors.text, border: colors.border },
    solid: { bg: colors.primary, fg: colors.white },
  };
  const p = active ? { bg: colors.primary, fg: colors.white } : palettes[variant];

  return (
    <Comp
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        { backgroundColor: p.bg },
        p.border ? { borderWidth: 1, borderColor: p.border } : null,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={13} color={p.fg} style={{ marginLeft: 4 }} /> : null}
      <Text style={[styles.text, { color: p.fg }]}>{label}</Text>
    </Comp>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  text: { fontSize: font.small, fontWeight: '600', writingDirection: 'rtl' },
});
