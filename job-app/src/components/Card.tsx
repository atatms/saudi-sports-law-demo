import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';

export default function Card({
  children,
  style,
  flat,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  flat?: boolean;
}) {
  return <View style={[styles.card, !flat && shadow.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
