import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Variant = 'default' | 'search';

type Props = TextInputProps & {
  variant?: Variant;
};

export const AppTextInput = ({
  variant = 'default',
  style,
  outlineStyle,
  left,
  ...rest
}: Props) => {
  const theme = useAppTheme();
  const isSearch = variant === 'search';

  return (
    <TextInput
      {...rest}
      mode="outlined"
      left={isSearch ? left ?? <TextInput.Icon icon="magnify" /> : left}
      style={[styles.input, isSearch ? styles.searchInput : null, style]}
      outlineStyle={[
        {
          borderRadius: isSearch
            ? theme.custom.metrics.radius.md
            : theme.custom.metrics.radius.sm,
        },
        outlineStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 24,
  },
});
