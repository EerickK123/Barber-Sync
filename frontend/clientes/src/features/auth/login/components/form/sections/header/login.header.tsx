import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/global/providers/theme';
import { useTranslation } from 'react-i18next';

export const LoginHeader = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="my-10 items-center">
      <Text
        className="mb-1 text-[10px] font-bold tracking-[0.25em]"
        style={{ color: theme.accent }}>
        {t('app.auth.login.form.header.welcomeTo')}
      </Text>

      <View className="flex-row items-center">
        <Text className="text-3xl font-black" style={{ color: theme.textPrimary }}>
          {t('app.auth.login.form.header.firstHalfName')}
        </Text>
        <Text className="text-3xl font-black" style={{ color: theme.accent }}>
          {t('app.auth.login.form.header.secondHalfName')}
        </Text>
      </View>

      <Text className="mt-1 text-xs font-normal" style={{ color: theme.textSecondary }}>
        {t('app.auth.login.form.header.slogan')}
      </Text>
    </View>
  );
};
