import { ReactNode } from 'react';

import { useTheme } from '@/global/providers/theme';

import { ScreenContainer } from './components/container/base_container.component';
import { ScreenContent } from './components/content/base_content.component';
import { ScreenKeyboard } from './components/keyboard/base_keyboard.component';
import { ScreenScroll } from './components/scroll/screen_scroll.component';

import { ScreenLayoutProps } from './types/base_layout.types';

const renderScrollableContent = (children: ReactNode) => {
  return <ScreenScroll>{children}</ScreenScroll>;
};

const renderStaticContent = (children: ReactNode) => {
  return children;
};

export const BaseLayout = ({
  children,
  scrollable = false,
  keyboard = false,
  safeArea = true,
  padding = 'md',
  keyboardOffset = 0,
  keyboardBehavior,
}: ScreenLayoutProps) => {
  const { theme } = useTheme();

  const content = keyboard || scrollable ? <ScreenScroll>{children}</ScreenScroll> : children;

  const wrappedContent = keyboard ? (
    <ScreenKeyboard keyboardOffset={keyboardOffset} keyboardBehavior={keyboardBehavior}>
      {content}
    </ScreenKeyboard>
  ) : (
    content
  );

  return (
    <ScreenContainer safeArea={safeArea} backgroundColor={theme.background}>
      <ScreenContent padding={padding}>{wrappedContent}</ScreenContent>
    </ScreenContainer>
  );
};
