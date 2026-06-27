import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  value: number; // 0..100
  color?: string;
  track?: string;
  height?: number;
}

/** Horizontal progress bar (RTL: fills from the right). */
export default function ProgressBar({ value, color = colors.primary, track = colors.divider, height = 8 }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { backgroundColor: track, height, borderRadius: height }]}>
      <View
        style={{
          width: `${pct}%`,
          height,
          backgroundColor: color,
          borderRadius: height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', flexDirection: 'row-reverse' },
});
