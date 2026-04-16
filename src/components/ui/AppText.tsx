import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Text, TextProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Tone = 'primary' | 'secondary' | 'muted' | 'danger' | 'inverse';
type Weight = 'regular' | 'medium' | 'bold' | 'heavy';

type Props = TextProps<never> & {
  tone?: Tone;
  weight?: Weight;
  style?: TextStyle | TextStyle[];
};

const weightMap: Record<Weight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  bold: '700',
  heavy: '900',
};

export const AppText = ({
  tone = 'primary',
  weight = 'regular',
  style,
  children,
  ...rest
}: Props) => {
  const theme = useAppTheme();

  const colorMap = {
    primary: theme.custom.semantic.text.primary,
    secondary: theme.custom.semantic.text.secondary,
    muted: theme.custom.semantic.text.muted,
    danger: theme.custom.semantic.text.danger,
    inverse: theme.custom.semantic.text.inverse,
  };

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        {
          color: colorMap[tone],
          fontWeight: weightMap[weight],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
