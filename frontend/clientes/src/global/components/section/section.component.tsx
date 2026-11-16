import React from 'react';

import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { PrefabText } from '@/global/components/text/text.component';

import { PrefabSectionProps } from './types/section.types';

export const PrefabSection = ({
  title,
  subtitle,
  children,
  actionComponent,
  translate = true,
}: PrefabSectionProps) => {
  const { t } = useTranslation();

  const resolvedTitle =
    title
      ? translate
        ? t(title)
        : title
      : undefined;

  const resolvedSubtitle =
    subtitle
      ? translate
        ? t(subtitle)
        : subtitle
      : undefined;

  return (
    <View className="mb-6 w-full">
      {resolvedTitle ? (
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <PrefabText
              variant="subtitle"
              translate={false}>
              {resolvedTitle}
            </PrefabText>

            {resolvedSubtitle ? (
              <PrefabText
                variant="caption"
                translate={false}
                style={{
                  marginTop: 2,
                }}>
                {resolvedSubtitle}
              </PrefabText>
            ) : null}
          </View>

          {actionComponent}
        </View>
      ) : null}

      {children}
    </View>
  );
};