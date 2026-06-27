import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font } from '../theme';

interface Props {
  initials: string;
  size?: number;
  bg?: string;
  fg?: string;
}

export default function Avatar({ initials, size = 44, bg = colors.primaryLight, fg = colors.primary }: Props) {
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: radius.md, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { color: fg, fontSize: size * 0.34 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '800' },
});
