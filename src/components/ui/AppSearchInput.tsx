import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar, SearchbarProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = SearchbarProps;

export const AppSearchInput = ({ style, ...rest }: Props) => {
  const theme = useAppTheme();

  return (
    <Searchbar
      {...rest}
      style={[
        styles.base,
        {
          borderRadius: theme.custom.metrics.radius.md,
        },
        style,
      ]}
      elevation={2}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    marginBottom: 24,
  },
});
