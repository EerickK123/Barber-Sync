import { ViewStyle } from 'react-native';
import { CardResolverParams, CardVariantMapping } from '../types/card.types';
import { ThemeColorsTypes } from '@/global/providers/theme';

export const getCardVariants = ({ theme, variant }: CardResolverParams) => {
  const isDarkMode = theme.background === '#000000';

  const mappings: CardVariantMapping = {
    // 🌟 VARIANT DEFAULT: Contenedor sólido, elevado y con volumen tridimensional sutil
    default: {
      className: 'w-full rounded-2xl p-5 mb-4 shadow-sm',
      container: {
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        // Sombra nativa que reacciona de forma limpia según el tema
        shadowColor: isDarkMode ? '#000000' : '#1e1b4b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDarkMode ? 0.4 : 0.06,
        shadowRadius: 12,
        elevation: 3,
      },
    },
    // 🌟 VARIANT OUTLINE: Enfoque estructural lineal, ideal para formularios limpios
    outline: {
      className: 'w-full rounded-2xl p-5 mb-4',
      container: {
        backgroundColor: 'transparent',
        borderColor: theme.border,
        borderWidth: 2, // Subimos a 2 para alinearse con los bordes de inputs/botones
      },
    },
    // 🌟 VARIANT GHOST: Totalmente plana, descansa sobre el fondo sin bordes ni sombras
    ghost: {
      className: 'w-full rounded-2xl p-5 mb-4',
      container: {
        backgroundColor: theme.surfaceMuted,
        borderWidth: 0, // Eliminamos bordes por completo
      },
    },
    // VARIANT BARBERSHOP: Se mantiene intacta como pediste
    barbershop: {
      className: 'w-full rounded-2xl mb-4 overflow-hidden',
      container: {
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        height: 240,
      },
    },
  };

  return mappings[variant] || mappings['default'];
};

export const getBarbershopGradient = (
  isDarkMode: boolean,
  theme: ThemeColorsTypes
): readonly [string, string, ...string[]] => {
  return isDarkMode
    ? (['transparent', 'rgba(0, 0, 0, 0.4)', `${theme.surface}CC`, theme.surface] as const)
    : (['transparent', 'rgba(0, 0, 0, 0.02)', theme.surface, theme.surface] as const);
};

export const getBarbershopGradientLocations = (
  isDarkMode: boolean
): readonly [number, number, ...number[]] => {
  return isDarkMode ? [0, 0.35, 0.7, 1] : [0, 0.4, 1, 1];
};
