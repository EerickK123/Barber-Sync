export type ThemeMode = 'light' | 'dark';

export interface ThemeColorsTypes {
  background: string;

  surface: string;
  surfaceMuted: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  accent: string;
  accentMuted: string;
  accentText: string;

  secondary: string;
  secondaryMuted: string;

  border: string;

  error: string;
  warning: string;
  success: string;
}

export interface ThemeContextProps {
  theme: ThemeColorsTypes;
  mode: ThemeMode;
  toggleTheme: () => void;
}
