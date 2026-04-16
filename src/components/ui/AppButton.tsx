import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerTonal';

type Props = ButtonProps & {
  variant?: Variant;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export const AppButton = ({
  variant = 'primary',
  fullWidth = true,
  contentStyle,
  style,
  ...rest
}: Props) => {
  const theme = useAppTheme();

  const configs: Record<
    Variant,
    {
      mode: ButtonProps['mode'];
      buttonColor?: string;
      textColor?: string;
    }
  > = {
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
  };

  const config = configs[variant];

  return (
    <Button
      {...rest}
      mode={config.mode}
      buttonColor={config.buttonColor}
      textColor={config.textColor}
      style={[
        styles.base,
        {
          borderRadius: theme.custom.metrics.radius.sm,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={styles.label}
    />
  );
};

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
