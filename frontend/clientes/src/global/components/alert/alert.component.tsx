import React from 'react';

import { Text, View, Pressable } from 'react-native';

import FontAwesome from "@react-native-vector-icons/fontawesome";

import { useTranslation } from 'react-i18next';

import { useTheme } from '@/global/providers/theme';

import { PrefabAlertProps, AlertContentParams, ClearButtonParams } from './types/alert.types';

import { getAlertVariants, getClearButtonRipple, getPressedOpacity } from './utils/alert.utils';

const renderAlertContent = ({ message, textColor, iconName, iconColor }: AlertContentParams) => (
  <View className="flex-1 flex-row items-center">
    <FontAwesome name={iconName} size={14} color={iconColor} />

    <Text
      className="flex-1 pr-2 pl-2 text-sm font-medium tracking-wide"
      style={{
        color: textColor,
      }}>
      {message}
    </Text>
  </View>
);

const renderClearButton = ({
  onClear,
  iconColor,
  rippleConfig,
  pressableStyle,
}: ClearButtonParams) => {
  return !onClear ? null : (
    <Pressable
      onPress={onClear}
      className="h-7 w-7 items-center justify-center rounded-full"
      android_ripple={rippleConfig}
      style={pressableStyle}>
      <FontAwesome name="close" size={13} color={iconColor} />
    </Pressable>
  );
};

export const PrefabAlert = ({
  message,
  variant = 'error',
  onClear,
  translate = true,
}: PrefabAlertProps) => {
  const { theme } = useTheme();

  const { t } = useTranslation();

  const config = getAlertVariants(theme, variant);

  const rippleConfig = getClearButtonRipple(config.icon.color);

  const pressableStyle = ({ pressed }: { pressed: boolean }) => getPressedOpacity(pressed);

  const resolvedMessage = message ? (translate ? t(message) : message) : undefined;

  return !resolvedMessage ? null : (
    <View
      className="mt-2 w-full flex-row items-center justify-between rounded-[14px] px-4 py-3"
      style={config.container}>
      {renderAlertContent({
        message: resolvedMessage,
        textColor: config.textColor,
        iconName: config.icon.name,
        iconColor: config.icon.color,
      })}

      {renderClearButton({
        onClear,
        iconColor: config.icon.color,
        rippleConfig,
        pressableStyle,
      })}
    </View>
  );
};
