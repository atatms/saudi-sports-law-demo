import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import ResumeAnalyzerScreen from '../screens/ResumeAnalyzerScreen';
import AtsScreen from '../screens/AtsScreen';
import ConnectPlatformsScreen from '../screens/ConnectPlatformsScreen';
import UploadCvScreen from '../screens/UploadCvScreen';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ResumeAnalyzer" component={ResumeAnalyzerScreen} />
      <Stack.Screen name="Ats" component={AtsScreen} />
      <Stack.Screen name="ConnectPlatforms" component={ConnectPlatformsScreen} />
      <Stack.Screen name="UploadCv" component={UploadCvScreen} />
    </Stack.Navigator>
  );
}
