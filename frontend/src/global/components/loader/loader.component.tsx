import React from 'react';

import { ActivityIndicator, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@/global/providers/theme';

import { PrefabText } from '@/global/components/text/text.component';

import { PrefabLoaderProps } from './types/loader.types';

export const PrefabLoader = ({
  text,
  translate = true,
}: PrefabLoaderProps) => {
  const { theme } = useTheme();

  const { t } = useTranslation();

  const resolvedText =
    text
      ? translate
        ? t(text)
        : text
      : undefined;

  return (
    <View className="flex-1 items-center justify-center py-10">
      <ActivityIndicator
        size="large"
        color={theme.accent}
      />

      {resolvedText ? (
        <PrefabText
          variant="caption"
          translate={false}
          style={{
            marginTop: 12,
          }}>
          {resolvedText}
        </PrefabText>
      ) : null}
    </View>
  );
};