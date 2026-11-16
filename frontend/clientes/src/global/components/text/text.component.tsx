import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/global/providers/theme';
import { PrefabTextProps } from './types/text.types';
import { getTextVariants } from './utils/text.utils';
export const PrefabText = ({
  children,
  variant = 'body',
  center = false,
  translate = true,
  style,
  ...rest
}: PrefabTextProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const resolvedVariant = getTextVariants({
    theme,
    variant,
  });
  const content = translate && typeof children === 'string' ? t(children) : children;
  return (
    <Text
      className={`${resolvedVariant.className} ${center ? 'text-center' : ''}`}
      style={[{ color: resolvedVariant.color }, style]}
      {...rest}>
      {content}
    </Text>
  );
};
