import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { darkPalette, lightPalette } from './palette';
import { darkAlpha, lightAlpha, metrics } from './tokens';
import type { AppTheme } from './types';

const buildTheme = (mode: 'light' | 'dark'): AppTheme => {
  const isDark = mode === 'dark';
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const palette = isDark ? darkPalette : lightPalette;
  const alpha = isDark ? darkAlpha : lightAlpha;

  return {
    ...base,
    roundness: metrics.radius.sm,
    colors: {
      ...base.colors,
      primary: palette.primary,
      secondary: palette.secondary,
      tertiary: palette.tertiary,
      background: palette.background,
      surface: palette.surface,
      surfaceVariant: palette.surfaceVariant,
      error: palette.error,
    },
    custom: {
      metrics,
      semantic: {
        text: {
          primary: base.colors.onSurface,
          secondary: base.colors.onSurfaceVariant,
          muted: base.colors.outline,
          danger: base.colors.error,
          inverse: base.colors.onPrimary,
        },
        action: {
          primaryBg: palette.primary,
          primaryText: base.colors.onPrimary,
          dangerBg: base.colors.error,
          dangerText: base.colors.onError,
          dangerTonalBg: base.colors.errorContainer,
          dangerTonalText: base.colors.onErrorContainer,
          ghostText: palette.primary,
        },
        border: {
          subtle: base.colors.outlineVariant,
          strong: base.colors.outline,
          accent: palette.primary,
        },
        feedback: {
          errorBg: base.colors.errorContainer,
          errorText: base.colors.onErrorContainer,
          infoBg: base.colors.secondaryContainer,
          infoText: base.colors.onSecondaryContainer,
        },
        alpha,
        divider: base.colors.outlineVariant,
      },
    },
  };
};

export const LightTheme = buildTheme('light');
export const DarkTheme = buildTheme('dark');
