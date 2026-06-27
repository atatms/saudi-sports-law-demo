import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, font } from '../theme';

interface Props {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showMax?: boolean;
}

/** Circular progress ring used for resume / ATS scores. */
export default function ScoreRing({
  score,
  max = 100,
  size = 84,
  strokeWidth = 7,
  color = colors.primary,
  label,
  showMax = true,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / max));
  const dashOffset = circumference * (1 - pct);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.divider}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { color, fontSize: size * 0.3 }]}>{score}</Text>
        {showMax && <Text style={styles.max}>/ {max}</Text>}
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  score: { fontWeight: '800' },
  max: { fontSize: font.tiny, color: colors.textMuted, marginTop: -2 },
  label: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2 },
});
