import { ViewStyle } from 'react-native';

export type PrefabAlertVariant = 'error' | 'warning' | 'success' | 'info';

export interface PrefabAlertProps {
  message?: string;

  variant?: PrefabAlertVariant;

  onClear?: () => void;

  translate?: boolean;
}

export interface AlertContentParams {
  message: string;

  textColor: string;

  iconName: 'ban' | 'warning' | 'check' | 'info';

  iconColor: string;
}

export interface ClearButtonParams {
  onClear?: () => void;

  iconColor: string;

  rippleConfig: {
    color: string;
    borderless: boolean;
  };

  pressableStyle: (state: { pressed: boolean }) => ViewStyle;
}

export type AlertStyleMapping = Record<
  PrefabAlertVariant,
  {
    container: {
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
    };

    textColor: string;

    icon: {
      name: 'ban' | 'warning' | 'check' | 'info';

      color: string;
    };
  }
>;
