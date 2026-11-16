import React from 'react';

import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { PrefabText } from '@/global/components/text/text.component';

import { PrefabEmptyProps } from './types/empty.types';

export const PrefabEmpty = ({
  title,
  description,
  actionComponent,
  translate = true,
}: PrefabEmptyProps) => {
  const { t } = useTranslation();

  const resolvedTitle = translate ? t(title) : title;

  const resolvedDescription = description ? (translate ? t(description) : description) : undefined;

  return (
    <View className="items-center justify-center py-12">
      <PrefabText variant="subtitle" translate={false}>
        {resolvedTitle}
      </PrefabText>

      {resolvedDescription ? (
        <PrefabText
          variant="caption"
          translate={false}
          center
          style={{
            marginTop: 8,
            maxWidth: 280,
          }}>
          {resolvedDescription}
        </PrefabText>
      ) : null}

      {actionComponent ? <View className="mt-5">{actionComponent}</View> : null}
    </View>
  );
};
