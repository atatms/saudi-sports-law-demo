import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import ResumeAnalyzerScreen from '../screens/ResumeAnalyzerScreen';
import AtsScreen from '../screens/AtsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ResumeAnalyzer" component={ResumeAnalyzerScreen} />
      <Stack.Screen name="Ats" component={AtsScreen} />
    </Stack.Navigator>
  );
}
