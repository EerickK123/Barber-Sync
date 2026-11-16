import React from 'react';

import { View } from 'react-native';

import { useTheme } from '@/global/providers/theme';

export const PrefabSeparator = () => {
  const { theme } = useTheme();

  return (
    <View
      className="my-4 h-[1px] w-full"
      style={{
        backgroundColor: theme.border,
      }}
    />
  );
};