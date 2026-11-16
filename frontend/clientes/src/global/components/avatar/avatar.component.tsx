import React from 'react';

import { Image, View } from 'react-native';

import { useTheme } from '@/global/providers/theme';

import { PrefabAvatarProps } from './types/avatar.types';

import { getAvatarVariants } from './utils/avatar.utils';

export const PrefabAvatar = ({ uri, size = 'md' }: PrefabAvatarProps) => {
  const { theme } = useTheme();

  const sizeClassName = getAvatarVariants(size);

  return (
    <View
      className={`${sizeClassName} overflow-hidden`}
      style={{
        borderWidth: 1,
        borderColor: theme.border,
      }}>
      <Image
        source={{
          uri:
            uri ??
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
        }}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
};
