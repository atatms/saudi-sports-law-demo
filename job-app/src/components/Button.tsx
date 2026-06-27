import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const fg = isPrimary ? colors.white : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.btn,
        isPrimary && { backgroundColor: colors.primary },
        isOutline && { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.inner}>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={[styles.label, { color: fg }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  inner: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm },
  label: { fontWeight: '800', fontSize: font.body, writingDirection: 'rtl' },
});
