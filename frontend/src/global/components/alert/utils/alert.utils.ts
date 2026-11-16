import { ThemeColorsTypes } from '@/global/providers/theme';
import { AlertStyleMapping, PrefabAlertVariant } from '../types/alert.types';

export const getAlertVariants = (theme: ThemeColorsTypes, variant: PrefabAlertVariant) => {
  const mappings: AlertStyleMapping = {
    error: {
      container: { borderWidth: 1, borderColor: theme.error, backgroundColor: `${theme.error}10` },
      textColor: theme.error,
      icon: { name: 'ban', color: theme.error },
    },
    warning: {
      container: {
        borderWidth: 1,
        borderColor: theme.warning,
        backgroundColor: `${theme.warning}10`,
      },
      textColor: theme.warning,
      icon: { name: 'warning', color: theme.warning },
    },
    success: {
      container: {
        borderWidth: 1,
        borderColor: theme.success,
        backgroundColor: `${theme.success}10`,
      },
      textColor: theme.success,
      icon: { name: 'check', color: theme.success },
    },
    info: {
      container: {
        borderWidth: 1,
        borderColor: theme.accent,
        backgroundColor: `${theme.accent}10`,
      },
      textColor: theme.accent,
      icon: { name: 'info', color: theme.accent },
    },
  };

  return mappings[variant];
};

export const getClearButtonRipple = (color: string) => ({
  color: `${color}33`,
  borderless: true,
});

export const getPressedOpacity = (pressed: boolean) => ({
  opacity: pressed ? 0.6 : 1,
});
