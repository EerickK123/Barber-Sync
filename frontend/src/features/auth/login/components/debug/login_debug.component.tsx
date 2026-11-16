import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/global/providers/theme';
import { useAuthStore } from '../../../../../global/stores';

interface LoginDebugProps {
  backendData: any;
}

export const LoginDebug = ({ backendData }: LoginDebugProps) => {
  const { theme } = useTheme();
  const [secureToken, setSecureToken] = useState<string | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadSecureStore = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        setSecureToken(token);
      } catch (err) {
        console.log('Error leyendo SecureStore en Debug:', err);
      }
    };
    loadSecureStore();
  }, [backendData, accessToken]);

  if (!__DEV__) return null;

  return (
    <View className="mt-6 w-full gap-4">
      {backendData && (
        <View className="gap-2 rounded-2xl border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <Text className="font-bold" style={{ color: theme.success }}>Backend Response</Text>
          <Text selectable style={{ color: theme.textPrimary }}>{JSON.stringify(backendData, null, 2)}</Text>
        </View>
      )}

      {accessToken && (
        <View className="gap-2 rounded-2xl border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <Text className="font-bold" style={{ color: theme.accent }}>Zustand Store</Text>
          <Text selectable style={{ color: theme.textSecondary }}>{JSON.stringify({ accessToken, user }, null, 2)}</Text>
        </View>
      )}

      {secureToken && (
        <View className="gap-2 rounded-2xl border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <Text className="font-bold" style={{ color: theme.success }}>Secure Store</Text>
          <Text selectable style={{ color: theme.textSecondary }}>{secureToken}</Text>
        </View>
      )}
    </View>
  );
};