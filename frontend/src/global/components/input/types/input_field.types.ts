import {
  NativeSyntheticEvent,
  TargetedEvent,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { ThemeColorsTypes } from '@/global/providers/theme';

export type FocusBlurCallback =
  | ((e: NativeSyntheticEvent<TargetedEvent>) => void)
  | undefined;

export type PrefabInputState =
  | 'default'
  | 'focused'
  | 'disabled'
  | 'error';

export interface PrefabInputProps extends TextInputProps {
  label: string;

  errorText?: string;

  disabled?: boolean;
}

export interface RenderFieldParams {
  disabled: boolean;

  theme: ThemeColorsTypes;

  containerStyle: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };

  shadowStyle: ViewStyle;

  setIsFocused: (focused: boolean) => void;

  restProps: TextInputProps;
}

export interface InputResolverParams {
  theme: ThemeColorsTypes;

  isFocused: boolean;

  disabled: boolean;

  hasError: boolean;
}

export type InputVariantMapping = Record<
  PrefabInputState,
  {
    container: {
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    };

    label: {
      color: string;
    };
  }
>;

export type InputStateStyleMapping = Record<
  PrefabInputState,
  ViewStyle
>;

export interface PrefabInputProps extends TextInputProps {
  label: string;

  errorText?: string;

  disabled?: boolean;

  translate?: boolean;
}