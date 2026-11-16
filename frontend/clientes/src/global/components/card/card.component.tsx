import React from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/global/providers/theme';
import { PrefabCardProps, CardContentParams, BarbershopCardParams } from './types/card.types';
import {
  getBarbershopGradient,
  getBarbershopGradientLocations,
  getCardVariants,
} from './utils/card.utils';

const renderBarbershopCard = ({
  coverUrl,
  avatarUrl,
  title,
  subtitle,
  theme,
  gradientColors,
  gradientLocations,
}: BarbershopCardParams) => (
  <ImageBackground
    source={{ uri: coverUrl}}
    className="flex-1 justify-end"
    resizeMode="cover"
    onError={(error) => console.log('avatar error', error.nativeEvent)}>
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      className="absolute inset-0"
    />

    <View className="z-10 w-full flex-row items-end p-4">
      <Image
        onError={(error) => console.log('avatar error', error.nativeEvent)}
        source={{ uri: avatarUrl }}
        className="mr-4 h-16 w-16 rounded-xl"
        style={{ borderColor: theme.border, borderWidth: 2 }}
      />

      <View className="flex-1 justify-center pb-1">
        <Text
          className="text-lg font-black tracking-wide"
          style={{ color: theme.textPrimary }}
          numberOfLines={1}>
          {title}
        </Text>

        <Text
          className="mt-0.5 font-mono text-xs tracking-widest"
          style={{ color: theme.accent }}
          numberOfLines={1}>
          {`#${subtitle}`}
        </Text>
      </View>
    </View>
  </ImageBackground>
);

const renderCardContent = ({
  variant,
  children,
  theme,
  coverUrl,
  avatarUrl,
  title,
  subtitle,
  gradientColors,
  gradientLocations,
}: CardContentParams) => {
  return variant === 'barbershop'
    ? renderBarbershopCard({
        coverUrl,
        avatarUrl,
        title,
        subtitle,
        theme,
        gradientColors,
        gradientLocations,
      })
    : children;
};

// =============================================================================
// COMPONENTE PRINCIPAL (Orquestador Puro)
// =============================================================================

export const PrefabCard = ({
  variant = 'default',
  style,
  className = '', // 🌟 Capturamos la prop className externa (por defecto vacía)
  children,
  coverUrl,
  avatarUrl,
  title,
  subtitle,
}: PrefabCardProps) => {
  const { theme } = useTheme();

  const resolvedVariant = getCardVariants({ theme, variant });
  const isDarkMode = theme.background === '#000000';

  const gradientColors = getBarbershopGradient(isDarkMode, theme);
  const gradientLocations = getBarbershopGradientLocations(isDarkMode);

  const combinedClassName = `${resolvedVariant.className} ${className}`.trim();

  return (
    <View className={combinedClassName} style={[resolvedVariant.container, style]}>
      {renderCardContent({
        variant,
        children,
        theme,
        coverUrl,
        avatarUrl,
        title,
        subtitle,
        gradientColors,
        gradientLocations,
      })}
    </View>
  );
};
