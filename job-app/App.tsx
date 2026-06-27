import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

// Enable right-to-left layout for the Arabic UI.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    primary: colors.primary,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  useEffect(() => {
    // No-op: RTL is configured at module load. Kept for future locale wiring.
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
