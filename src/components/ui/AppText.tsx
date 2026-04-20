import React, { memo, useMemo } from 'react';
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

export const AppText = memo(
  ({
    tone = 'primary',
    weight = 'regular',
    style,
    children,
    ...rest
  }: Props) => {
    const theme = useAppTheme();

    const textStyle = useMemo(
      () => [
        styles.base,
        {
          color: theme.custom.semantic.text[tone],
          fontWeight: weightMap[weight],
        },
        style,
      ],
      [style, theme.custom.semantic.text, tone, weight],
    );

    return (
      <Text {...rest} style={textStyle}>
        {children}
      </Text>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
