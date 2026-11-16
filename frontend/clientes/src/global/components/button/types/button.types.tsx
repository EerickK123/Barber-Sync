import { ReactNode } from 'react';
import { ThemeColorsTypes } from '../../../../global/providers/theme';
import { TouchableOpacityProps } from 'react-native';

export type PrefabButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'icon';

export interface PrefabButtonProps extends TouchableOpacityProps {
  title?: string;

  onPress: () => void;

  variant?: PrefabButtonVariant;

  isLoading?: boolean;

  disabled?: boolean;

  icon?: ReactNode;

  className?: string;

  translate?: boolean;
}

export type ButtonStyleMapping = Record<
  PrefabButtonVariant,
  {
    container: {
      backgroundColor: string;
      borderColor?: string;
      borderWidth?: number;
    };

    text: {
      color: string;
    };
  }
>;

export interface ResolverParams {
  theme: ThemeColorsTypes;

  variant: PrefabButtonVariant;

  disabled: boolean;
}

export interface GlowWrapperProps {
  children: React.ReactNode;

  variant: PrefabButtonVariant;

  baseColor: string;

  className?: string;
}

export interface LoadingWrapperProps {
  isLoading: boolean;

  title?: string;

  textColor: string;

  icon?: ReactNode;

  variant: PrefabButtonVariant;

  translate: boolean;
}