import { PropsWithChildren } from 'react';

import { KeyboardAvoidingViewProps } from 'react-native';

export type ScreenLayoutPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';

export interface ScreenLayoutProps
  extends PropsWithChildren {
  scrollable?: boolean;

  keyboard?: boolean;

  safeArea?: boolean;

  padding?: ScreenLayoutPadding;

  backgroundColor?: string;

  keyboardOffset?: number;

  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
}

export interface ScreenKeyboardProps extends PropsWithChildren {
  keyboardOffset?: number;
  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
}
