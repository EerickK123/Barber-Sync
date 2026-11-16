import { useTheme } from '@/global/providers/theme';
import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps extends PropsWithChildren {
  safeArea?: boolean;
  backgroundColor: string;
}

export const ScreenContainer = ({
  children,
  safeArea = true,
  backgroundColor,
}: ScreenContainerProps) => {
  const ContainerComponent = safeArea ? SafeAreaView : View;
  return (
    <ContainerComponent
      className="flex-1"
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}>
      {children}
    </ContainerComponent>
  );
};
