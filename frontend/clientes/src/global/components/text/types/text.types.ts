import { TextProps } from 'react-native';

import { ThemeColorsTypes } from '@/global/providers/theme';

export type PrefabTextVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button'
  | 'error'
  | 'success'
  | 'accent';

export interface PrefabTextProps extends TextProps {
  children: React.ReactNode;

  variant?: PrefabTextVariant;

  center?: boolean;

  translate?: boolean;
}

export interface TextResolverParams {
  theme: ThemeColorsTypes;

  variant: PrefabTextVariant;
}

export type TextVariantMapping = Record<
  PrefabTextVariant,
  {
    className: string;

    color: string;
  }
>;
