import React, { memo, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  vertical?: boolean;
  size?: number;
  style?: ViewStyle | ViewStyle[];
};

export const AppDivider = memo(
  ({ vertical = false, size = 1, style }: Props) => {
    const theme = useAppTheme();
    const dividerStyle = useMemo(
      () => [
        vertical
          ? {
              width: size,
              height: 40,
            }
          : {
              height: size,
              width: '100%' as const,
            },
        {
          backgroundColor: theme.custom.semantic.divider,
          opacity: 0.5,
        },
        styles.base,
        style,
      ],
      [size, style, theme.custom.semantic.divider, vertical],
    );

    return <View style={dividerStyle} />;
  },
);

const styles = StyleSheet.create({
  base: {},
});
