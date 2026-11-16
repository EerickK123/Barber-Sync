import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../providers/theme';
import { GlowWrapperProps, LoadingWrapperProps, PrefabButtonProps } from './types/button.types';
import { getButtonVariants, getDynamicGlowColors } from './utils/button.utils';

export const PrefabButton = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  icon,
  className,
  translate = true,
  ...rest
}: PrefabButtonProps) => {
  const { theme } = useTheme();

  const { container, text } = getButtonVariants({
    theme,
    variant,
    disabled,
  });

  const resolvedContainerStyle = {
    ...container,
    ...(style as object),
  };

  const baseColor = resolvedContainerStyle.backgroundColor;

  return (
    <GlowWrapper variant={variant} baseColor={baseColor} className={className}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        disabled={disabled || isLoading}
        className={`h-full w-full flex-row items-center justify-center rounded-[14px] ${
          variant === 'icon' ? 'p-0' : 'px-4'
        }`}
        style={resolvedContainerStyle}
        {...rest}>
        <LoadingWrapper
          isLoading={isLoading}
          title={title}
          textColor={text.color}
          icon={icon}
          variant={variant}
          translate={translate}
        />
      </TouchableOpacity>
    </GlowWrapper>
  );
};

const GlowWrapper = ({ children, variant, baseColor, className = '' }: GlowWrapperProps) => {
  const isGlowing =
    variant === 'primary' ? (
      <>
        <LinearGradient
          colors={getDynamicGlowColors(baseColor)}
          className="absolute top-[56px] left-[2%] h-[15px] w-[96%]"
          style={{
            zIndex: -1,
            borderRadius: 14,
          }}
        />
        {children}
      </>
    ) : (
      <>{children}</>
    );

  const sizeClass = variant === 'icon' ? 'w-[56px]' : 'w-full';

  const marginClass = variant === 'icon' ? '' : 'mb-6';

  return (
    <View
      className={`relative h-[56px] items-center rounded-[14px] ${sizeClass} ${marginClass} ${className}`}
      style={{
        overflow: 'visible',
      }}>
      {isGlowing}
    </View>
  );
};

const LoadingWrapper = ({
  isLoading,
  title,
  textColor,
  icon,
  variant,
  translate,
}: LoadingWrapperProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    return <ActivityIndicator color={textColor} size="small" />;
  }
  if (variant === 'icon' && icon) {
    return <>{icon}</>;
  }
  return (
    <Text
      className="text-base font-bold tracking-wide"
      style={{
        color: textColor,
      }}>
      {translate && title ? t(title) : title}
    </Text>
  );
};
