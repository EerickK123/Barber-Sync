import { NativeSyntheticEvent, TargetedEvent, ViewStyle } from 'react-native';

import {
  FocusBlurCallback,
  InputResolverParams,
  InputStateStyleMapping,
  InputVariantMapping,
  PrefabInputState,
} from '../types/input_field.types';

const getActiveState = (
  disabled: boolean,
  hasError: boolean,
  isFocused: boolean
): PrefabInputState => {
  const states: { condition: boolean; name: PrefabInputState }[] = [
    { condition: disabled, name: 'disabled' },
    { condition: hasError, name: 'error' },
    { condition: isFocused, name: 'focused' },
  ];

  return states.find((state) => state.condition)?.name ?? 'default';
};

export const getInputVariants = ({
  theme,
  isFocused,
  disabled,
  hasError,
}: InputResolverParams) => {
  const activeState = getActiveState(disabled, hasError, isFocused);

  const mappings: InputVariantMapping = {
    default: {
      container: {
        backgroundColor: theme.surfaceMuted,
        borderColor: theme.border,
        borderWidth: 1,
      },
      label: {
        color: theme.textPrimary,
      },
    },

    focused: {
      container: {
        backgroundColor: theme.surfaceMuted,
        borderColor: theme.accent,
        borderWidth: 1,
      },
      label: {
        color: theme.textPrimary,
      },
    },

    error: {
      container: {
        backgroundColor: theme.surfaceMuted,
        borderColor: theme.error,
        borderWidth: 1,
      },
      label: {
        color: theme.error,
      },
    },

    disabled: {
      container: {
        backgroundColor: theme.surface,
        borderColor: 'transparent',
        borderWidth: 0,
      },
      label: {
        color: theme.textMuted,
      },
    },
  };

  return mappings[activeState];
};

export const getInputShadowStyles = ({
  theme,
  isFocused,
  disabled,
  hasError,
}: InputResolverParams) => {
  const activeState = getActiveState(disabled, hasError, isFocused);

  const isDarkMode = theme.background === '#000000';

  const baseShadow: ViewStyle = isDarkMode
    ? {
        shadowColor: theme.textMuted,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: isFocused ? 0.25 : 0.08,
        shadowRadius: isFocused ? 8 : 4,
        elevation: isFocused ? 2 : 0,
      }
    : {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: isFocused ? 0.06 : 0.03,
        shadowRadius: isFocused ? 6 : 4,
        elevation: isFocused ? 1 : 0,
      };

  const mappings: InputStateStyleMapping = {
    default: {
      ...baseShadow,
    },

    focused: {
      ...baseShadow,
    },

    error: {
      ...baseShadow,
      shadowColor: theme.error,
      shadowOpacity: 0.1,
    },

    disabled: {
      shadowOpacity: 0,
      elevation: 0,
    },
  };

  return mappings[activeState];
};

export const createFocusHandler = (
  setFocusState: (focused: boolean) => void,
  targetState: boolean,
  userCallback: FocusBlurCallback = () => {}
) => {
  return (e: NativeSyntheticEvent<TargetedEvent>) => {
    setFocusState(targetState);

    userCallback(e);
  };
};