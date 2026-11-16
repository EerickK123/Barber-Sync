import React, { useState } from 'react';

import { Text, TextInput, View } from 'react-native';

import { useTheme } from '@/global/providers/theme';

import { PrefabInputProps, RenderFieldParams } from './types/input_field.types';

import {
  createFocusHandler,
  getInputShadowStyles,
  getInputVariants,
} from './utils/input_field.utils';

import { useTranslation } from 'react-i18next';

export const PrefabInput = ({
  label,
  errorText,
  disabled = false,
  translate = true,
  ...rest
}: PrefabInputProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!errorText;

  const { container, label: labelStyle } = getInputVariants({
    theme,
    isFocused,
    disabled,
    hasError,
  });

  const shadowStyle = getInputShadowStyles({
    theme,
    isFocused,
    disabled,
    hasError,
  });

  return (
    <View
      className="mb-4 w-full"
      style={{
        overflow: 'visible',
      }}>
      {renderInputLabel(translate ? t(label) : label, labelStyle.color)}

      {renderInputField({
        disabled,
        theme,
        containerStyle: container,
        shadowStyle,
        setIsFocused,
        restProps: rest,
      })}

      {renderErrorText(errorText ? (translate ? t(errorText) : errorText) : undefined, theme.error)}
    </View>
  );
};

const renderInputLabel = (label: string, color: string) => (
  <Text className="mb-1.5 pl-0.5 text-sm font-semibold tracking-wide" style={{ color }}>
    {label}
  </Text>
);

const renderInputField = ({
  disabled,
  theme,
  containerStyle,
  shadowStyle,
  setIsFocused,
  restProps: { onFocus, onBlur, ...rest },
}: RenderFieldParams) => {
  const handleFocus = createFocusHandler(setIsFocused, true, onFocus);

  const handleBlur = createFocusHandler(setIsFocused, false, onBlur);

  return (
    <View
      className="h-[56px] w-full justify-center rounded-[14px] px-4"
      style={{
        ...containerStyle,
        ...shadowStyle,
        overflow: 'visible',
      }}>
      <TextInput
        editable={!disabled}
        placeholderTextColor={theme.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="h-full w-full text-[15px] font-normal"
        style={{
          color: disabled ? theme.textMuted : theme.textPrimary,
        }}
        {...rest}
      />
    </View>
  );
};

const renderErrorText = (errorText?: string, color?: string) => {
  if (!errorText) {
    return null;
  }

  return (
    <Text className="mt-1.5 pl-1 text-xs font-medium" style={{ color }}>
      {errorText}
    </Text>
  );
};
