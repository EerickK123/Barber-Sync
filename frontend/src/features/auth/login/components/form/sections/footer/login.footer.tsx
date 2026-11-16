import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/global/providers/theme';
import { PrefabButton, PrefabLink } from '@/global/components';
import Feather from "@react-native-vector-icons/feather";
import { useTranslation } from 'react-i18next';

export const LoginFooter = ({ isPending }: { isPending: boolean }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mt-8 w-full" style={{ overflow: 'visible' }}>
      <View className="flex-row items-center justify-center">
        <Text className="text-sm font-normal" style={{ color: theme.textSecondary }}>
          {`${t('app.auth.login.form.footer.haventAccount')} `}
        </Text>
        <PrefabLink
          text={t('app.auth.login.form.footer.register')}
          onPress={() => !isPending && router.push('/(public)/(auth)/register')}
        />
      </View>
    </View>
  );
};

export const ThemeButton = () => {
  const { theme, mode, toggleTheme } = useTheme();
  return (
    <View className="absolute right-6 bottom-[-80px] z-50" pointerEvents="box-none">
      <PrefabButton
        variant="icon"
        className="shadow-2xl"
        style={{ backgroundColor: theme.border }}
        icon={<Feather name={mode === 'dark' ? 'sun' : 'moon'} size={22} color={theme.textPrimary} />}
        onPress={toggleTheme}
      />
    </View>
  );
};

export const TranslateButton = () => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const nextLanguage = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <View className="absolute bottom-[-80px] left-9 z-50" pointerEvents="box-none">
      <PrefabButton
        variant="icon"
        className="shadow-2xl"
        style={{ backgroundColor: theme.border }}
        icon={<Feather name="globe" size={22} color={theme.textPrimary} />}
        onPress={handleLanguageToggle}
      />
    </View>
  );
};