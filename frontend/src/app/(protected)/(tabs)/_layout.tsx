import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "@react-native-vector-icons/feather";
import { useTheme } from '@/global/providers/theme';

const TabsLayout = () => {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: theme.background,
        },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 60,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
      }}>
      <Tabs.Screen
        name="reservations"
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,

          animation: 'fade',
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          animation: 'fade',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          animation: 'fade',
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
