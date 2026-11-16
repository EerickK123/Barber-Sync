import {
  LinkResolverParams,
  LinkVariantMapping,
} from '../types/link.types';

export const getLinkVariants = ({
  theme,
  variant,
}: LinkResolverParams) => {
  const mappings: LinkVariantMapping = {
    primary: {
      color: theme.accent,
      className: 'text-sm font-bold',
    },

    secondary: {
      color: theme.textSecondary,
      className: 'text-sm font-semibold',
    },

    danger: {
      color: theme.error,
      className: 'text-sm font-bold',
    },

    muted: {
      color: theme.textMuted,
      className: 'text-sm font-medium',
    },
  };

  return mappings[variant];
};