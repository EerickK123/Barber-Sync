import { PressableProps } from 'react-native';

import { ThemeColorsTypes } from '@/global/providers/theme';

export type PrefabLinkVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'muted';

export interface PrefabLinkProps
  extends PressableProps {
  text: string;

  variant?: PrefabLinkVariant;

  classNameText?: string;

  color?: string;

  translate?: boolean;
}

export interface LinkResolverParams {
  theme: ThemeColorsTypes;

  variant: PrefabLinkVariant;
}

export type LinkVariantMapping = Record<
  PrefabLinkVariant,
  {
    color: string;

    className: string;
  }
>;