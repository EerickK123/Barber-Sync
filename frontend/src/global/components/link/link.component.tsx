import React from 'react';

import { Pressable, Text } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@/global/providers/theme';

import { PrefabLinkProps } from './types/link.types';

import { getLinkVariants } from './utils/link.utils';

export const PrefabLink = ({
  text,
  variant = 'primary',
  classNameText,
  style,
  color,
  translate = true,
  ...props
}: PrefabLinkProps) => {
  const { theme } = useTheme();

  const { t } = useTranslation();

  const config = getLinkVariants({
    theme,
    variant,
  });

  const resolvedText = translate ? t(text) : text;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
        style as any,
      ]}>
      <Text
        className={classNameText ?? config.className}
        style={{
          color: color ?? config.color,
        }}>
        {resolvedText}
      </Text>
    </Pressable>
  );
};
