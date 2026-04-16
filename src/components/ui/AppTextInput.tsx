import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = TextInputProps;

export const AppTextInput = ({ style, outlineStyle, ...rest }: Props) => {
  const theme = useAppTheme();

  return (
    <TextInput
      {...rest}
      mode="outlined"
      style={[styles.input, style]}
      outlineStyle={[
        {
          borderRadius: theme.custom.metrics.radius.sm,
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
});
