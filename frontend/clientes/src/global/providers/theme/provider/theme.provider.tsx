import { PropsWithChildren, useMemo, useState } from 'react';
import { ThemeContext } from '../context/theme.context';
import { themeColors } from '../colors/theme.colors';
import { ThemeMode } from '../types/theme.types';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => themeColors[mode], [mode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
