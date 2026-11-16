import { ButtonStyleMapping, ResolverParams } from '../types/button.types';

export const getButtonVariants = ({ theme, variant, disabled }: ResolverParams) => {
  if (disabled) {
    return {
      container: { backgroundColor: theme.surfaceMuted, borderWidth: 0 },
      text: { color: theme.textMuted },
    };
  }

  const mappings: ButtonStyleMapping = {
    primary: {
      container: { backgroundColor: theme.accent },
      text: { color: theme.accentText },
    },
    secondary: {
      container: { backgroundColor: theme.surface },
      text: { color: theme.textPrimary },
    },
    outline: {
      container: { backgroundColor: 'transparent', borderColor: theme.border, borderWidth: 2 },
      text: { color: theme.textPrimary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: theme.textSecondary },
    },
    // 🌟 Estilo base para el botón cuadrado flotante
    icon: {
      container: { 
        backgroundColor: theme.surfaceMuted, 
        borderColor: theme.border, 
        borderWidth: 1 
      },
      text: { color: theme.textPrimary }, // El color por si heredas tinte para el icono
    },
  };

  return mappings[variant] || mappings['primary'];
};

export const getDynamicGlowColors = (baseColor: string): [string, string, string] => {
  if (baseColor && baseColor.startsWith('#') && baseColor.length === 7) {
    return [`${baseColor}80`, `${baseColor}20`, 'transparent'];
  }
  return [baseColor || 'rgba(0,0,0,0)', 'rgba(255, 255, 255, 0.15)', 'transparent'];
};