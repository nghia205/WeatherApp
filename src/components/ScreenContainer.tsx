import React, { memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface, useTheme } from 'react-native-paper';

interface Props {
  children: React.ReactNode;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
}

const SAFE_AREA_EDGES = ['top'] as const;

export const ScreenContainer = memo(
  ({ children, paddingHorizontal = 16, style }: Props) => {
    const theme = useTheme();
    const safeAreaStyle = useMemo(
      () => [styles.flex, { backgroundColor: theme.colors.background }],
      [theme.colors.background],
    );
    const surfaceStyle = useMemo(
      () => [
        styles.flex,
        {
          paddingHorizontal,
          backgroundColor: theme.colors.background,
        },
        style,
      ],
      [paddingHorizontal, style, theme.colors.background],
    );

    return (
      <SafeAreaView edges={SAFE_AREA_EDGES} style={safeAreaStyle}>
        <Surface style={surfaceStyle}>{children}</Surface>
      </SafeAreaView>
    );
  },
);

const styles = {
  flex: {
    flex: 1,
  },
} satisfies Record<string, ViewStyle>;
