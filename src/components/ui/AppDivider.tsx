import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  vertical?: boolean;
  size?: number;
  style?: ViewStyle | ViewStyle[];
};

export const AppDivider = ({ vertical = false, size = 1, style }: Props) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        vertical
          ? {
              width: size,
              height: 40,
            }
          : {
              height: size,
              width: '100%',
            },
        {
          backgroundColor: theme.custom.semantic.divider,
          opacity: 0.5,
        },
        styles.base,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {},
});
