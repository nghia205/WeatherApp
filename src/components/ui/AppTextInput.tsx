import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Variant = 'default' | 'search';

type Props = TextInputProps & {
  variant?: Variant;
};

export const AppTextInput = memo(
  ({ variant = 'default', style, outlineStyle, left, ...rest }: Props) => {
    const theme = useAppTheme();
    const isSearch = variant === 'search';
    const inputStyle = useMemo(
      () => [styles.input, isSearch ? styles.searchInput : null, style],
      [isSearch, style],
    );
    const inputOutlineStyle = useMemo(
      () => [
        {
          borderRadius: isSearch
            ? theme.custom.metrics.radius.md
            : theme.custom.metrics.radius.sm,
        },
        outlineStyle,
      ],
      [
        isSearch,
        outlineStyle,
        theme.custom.metrics.radius.md,
        theme.custom.metrics.radius.sm,
      ],
    );
    const searchIcon = useMemo(() => <TextInput.Icon icon="magnify" />, []);

    return (
      <TextInput
        {...rest}
        mode="outlined"
        left={isSearch ? left ?? searchIcon : left}
        style={inputStyle}
        outlineStyle={inputOutlineStyle}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 24,
  },
});
