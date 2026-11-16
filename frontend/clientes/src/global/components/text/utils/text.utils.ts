import { TextResolverParams, TextVariantMapping } from '../types/text.types';

export const getTextVariants = ({ theme, variant }: TextResolverParams) => {
  const mappings: TextVariantMapping = {
    title: {
      className: 'text-3xl font-black tracking-wide',
      color: theme.textPrimary,
    },

    subtitle: {
      className: 'text-base font-medium tracking-wide',
      color: theme.textSecondary,
    },

    body: {
      className: 'text-sm font-normal tracking-wide',
      color: theme.textPrimary,
    },

    caption: {
      className: 'text-xs font-medium tracking-wide',
      color: theme.textMuted,
    },

    button: {
      className: 'text-base font-bold tracking-wide',
      color: theme.accentText,
    },

    error: {
      className: 'text-sm font-semibold tracking-wide',
      color: theme.error,
    },

    success: {
      className: 'text-sm font-semibold tracking-wide',
      color: theme.success,
    },

    accent: {
      className: 'text-sm font-bold tracking-wide',
      color: theme.accent,
    },
  };

  return mappings[variant];
};
