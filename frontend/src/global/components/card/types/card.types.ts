import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ThemeColorsTypes } from '@/global/providers/theme';

export type CardVariant = 'default' | 'outline' | 'ghost' | 'barbershop';

export interface PrefabCardProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  className?: string; // 🌟 Añadido para dar soporte completo a clases de Tailwind (NativeWind)
  coverUrl?: string;
  avatarUrl?: string;
  title?: string;
  subtitle?: string;
}

export interface CardResolverParams {
  theme: ThemeColorsTypes;
  variant: CardVariant;
}

// Interfaces para las funciones auxiliares estáticas de renderizado
export interface BarbershopCardParams {
  coverUrl?: string;
  avatarUrl?: string;
  title?: string;
  subtitle?: string;
  theme: ThemeColorsTypes;
  gradientColors: readonly [string, string, ...string[]];
  gradientLocations: readonly [number, number, ...number[]];
}

export interface CardContentParams {
  variant: CardVariant;
  children?: ReactNode;
  theme: ThemeColorsTypes;
  coverUrl?: string;
  avatarUrl?: string;
  title?: string;
  subtitle?: string;
  gradientColors: readonly [string, string, ...string[]];
  gradientLocations: readonly [number, number, ...number[]];
}

export type CardVariantMapping = Record<
  CardVariant,
  {
    className: string;
    container: ViewStyle;
  }
>;