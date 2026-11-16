import { ThemeColorsTypes } from '../types/theme.types';

export const themeColors = {
  dark: {
    background: '#000000',
    surface: '#0A0A0F',
    surfaceMuted: '#12121A',

    textPrimary: '#FFFFFF',
    textSecondary: '#8B9BB4',
    textMuted: '#3A4454',

    accent: '#0049FF',
    accentMuted: '#0049FF26',
    accentText: '#FFFFFF',

    secondary: '#0099FF',
    secondaryMuted: '#0099FF1F',

    border: '#1A1C23',

    error: '#E60026',
    warning: '#FFB800',
    success: '#00B341',
  } as ThemeColorsTypes,

  light: {
    background: '#FFFFFF',
    surface: '#F4F6FA',
    surfaceMuted: '#E5E9F5',

    textPrimary: '#000814',
    textSecondary: '#1E293B',
    textMuted: '#64748B',

    accent: '#0049FF',
    accentMuted: '#003EB31F',
    accentText: '#FFFFFF',

    secondary: '#0077FF',
    secondaryMuted: '#0077FF14',

    border: '#CBD5E1',

    error: '#C5001A',
    warning: '#D97706',
    success: '#008736',
  } as ThemeColorsTypes,
};
