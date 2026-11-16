import React from 'react';
import { View } from 'react-native';
import { PrefabText } from '@/global/components/text/text.component';
import { PrefabHeaderProps } from './types/header.types';

import { getHeaderContainerClasses, getHeaderTextContainerClasses } from './utils/header.utils';

import { useTranslation } from 'react-i18next';

const renderSubtitle = (subtitle?: string) => {
  if (!subtitle) {
    return null;
  }

  return (
    <PrefabText
      variant="subtitle"
      style={{
        marginTop: 4,
      }}>
      {subtitle}
    </PrefabText>
  );
};

export const PrefabHeader = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  className,
  translate = true,
}: PrefabHeaderProps) => {
  const hasLeftComponent = !!leftComponent;
  const { t } = useTranslation();
  const hasRightComponent = !!rightComponent;

  const resolvedTitle = translate ? t(title) : title;

  const resolvedSubtitle = subtitle ? (translate ? t(subtitle) : subtitle) : undefined;

  return (
    <View className={getHeaderContainerClasses(className)}>
      {leftComponent}
      <View className={getHeaderTextContainerClasses(hasLeftComponent, hasRightComponent)}>
        <PrefabText variant="title">{resolvedTitle}</PrefabText>
        {renderSubtitle(resolvedSubtitle)}
      </View>
      {rightComponent}
    </View>
  );
};
