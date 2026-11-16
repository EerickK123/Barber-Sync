import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { ScreenLayoutPadding } from '../../types/base_layout.types';

interface ScreenContentProps extends PropsWithChildren {
  padding?: ScreenLayoutPadding;
}

const paddingVariants: Record<ScreenLayoutPadding, string> = {
  none: '',
  sm: 'px-3',
  md: 'px-5',
  lg: 'px-7',
};

export const ScreenContent = ({
  children,
  padding = 'md',
}: ScreenContentProps) => {
  return (
    <View
      className={`flex-1 ${paddingVariants[padding]}`}
      style={{
        flex: 1
      }}>
      {children}
    </View>
  );
};