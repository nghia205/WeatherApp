import React, { memo, useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerTonal';

type Props = ButtonProps & {
  variant?: Variant;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export const AppButton = memo(
  ({
    variant = 'primary',
    fullWidth = true,
    contentStyle,
    style,
    ...rest
  }: Props) => {
    const theme = useAppTheme();

    const configs = useMemo<
      Record<
        Variant,
        {
          mode: ButtonProps['mode'];
          buttonColor?: string;
          textColor?: string;
        }
      >
    >(
      () => ({
        primary: {
          mode: 'contained',
          buttonColor: theme.custom.semantic.action.primaryBg,
          textColor: theme.custom.semantic.action.primaryText,
        },
        secondary: {
          mode: 'outlined',
        },
        ghost: {
          mode: 'text',
          textColor: theme.custom.semantic.action.ghostText,
        },
        danger: {
          mode: 'contained',
          buttonColor: theme.custom.semantic.action.dangerBg,
          textColor: theme.custom.semantic.action.dangerText,
        },
        dangerTonal: {
          mode: 'contained-tonal',
          buttonColor: theme.custom.semantic.action.dangerTonalBg,
          textColor: theme.custom.semantic.action.dangerTonalText,
        },
      }),
      [theme.custom.semantic.action],
    );

    const config = configs[variant];
    const buttonStyle = useMemo(
      () => [
        styles.base,
        {
          borderRadius: theme.custom.metrics.radius.sm,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ],
      [fullWidth, style, theme.custom.metrics.radius.sm],
    );
    const buttonContentStyle = useMemo(
      () => [styles.content, contentStyle],
      [contentStyle],
    );

    return (
      <Button
        {...rest}
        mode={config.mode}
        buttonColor={config.buttonColor}
        textColor={config.textColor}
        style={buttonStyle}
        contentStyle={buttonContentStyle}
        labelStyle={styles.label}
      />
    );
  },
);

const styles = StyleSheet.create({
  base: {},
  content: {
    minHeight: 48,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
