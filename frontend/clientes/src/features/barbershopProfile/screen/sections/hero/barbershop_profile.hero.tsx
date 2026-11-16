import React from 'react';
import { View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/global/providers/theme';
import { PrefabText } from '@/global/components/text/text.component';
import { PrefabAvatar } from '@/global/components/avatar/avatar.component';
import { BarbershopHeroProps } from '@/features/barbershopProfile/types/barbershop_profile.types';

export const BarbershopHero = ({ info }: BarbershopHeroProps) => {
  const { theme } = useTheme();

  return (
    <View>
      {/* Cover */}
      <View style={{ height: 220 }}>
        <Image
          source={{ uri: info.cover }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', theme.background]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 }}
        />
      </View>

      {/* Avatar + nombre */}
      <View className="flex-row items-end px-5" style={{ marginTop: -40 }}>
        <View
          className="rounded-full"
          style={{ borderWidth: 3, borderColor: theme.background }}
        >
          <PrefabAvatar uri={info.avatar} size="lg" />
        </View>
        <View className="ml-4 flex-1 pb-2">
          <PrefabText variant="title" translate={false} numberOfLines={1}>
            {info.name}
          </PrefabText>
          <PrefabText
            variant="caption"
            translate={false}
            className="font-mono mt-0.5"
            style={{ color: theme.accent }}
          >
            #{info.code}
          </PrefabText>
        </View>
      </View>

      {/* Descripción */}
      <View className="px-5 mt-4">
        <PrefabText
          variant="body"
          translate={false}
          className="leading-5 font-medium"
        >
          {info.description}
        </PrefabText>
      </View>
    </View>
  );
};