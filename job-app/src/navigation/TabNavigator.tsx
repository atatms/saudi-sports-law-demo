import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import JobsScreen from '../screens/JobsScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import LearningScreen from '../screens/LearningScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TabParamList } from './types';
import { colors, font } from '../theme';
import { useLang } from '../context/LanguageContext';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Home: { on: 'home', off: 'home-outline' },
  Jobs: { on: 'search', off: 'search-outline' },
  Applications: { on: 'business', off: 'business-outline' },
  Learning: { on: 'play-circle', off: 'play-circle-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

const LABELS_AR: Record<keyof TabParamList, string> = {
  Home: 'الرئيسية',
  Jobs: 'الوظائف',
  Applications: 'طلباتي',
  Learning: 'التعلم',
  Profile: 'ملفي',
};

const LABELS_EN: Record<keyof TabParamList, string> = {
  Home: 'Home',
  Jobs: 'Jobs',
  Applications: 'Applications',
  Learning: 'Learning',
  Profile: 'Profile',
};

export default function TabNavigator() {
  const { lang } = useLang();
  const LABELS = lang === 'ar' ? LABELS_AR : LABELS_EN;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.divider,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: font.tiny, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name];
          return <Ionicons name={focused ? set.on : set.off} size={size} color={color} />;
        },
        tabBarLabel: LABELS[route.name],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Learning" component={LearningScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
