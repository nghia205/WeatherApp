import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Variant = 'default' | 'elevated' | 'glass';

type BaseProps = Omit<
  React.ComponentProps<typeof Card>,
  'mode' | 'style' | 'elevation'
>;

type Props = BaseProps & {
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
};

export const AppCard = ({
  variant = 'default',
  style,
  children,
  elevation,
  ...rest
}: Props) => {
  const theme = useAppTheme();

  const variantStyle: Record<Variant, ViewStyle> = {
    default: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.custom.metrics.radius.lg,
    },
    elevated: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.custom.metrics.radius.xl,
    },
    glass: {
      backgroundColor: theme.custom.semantic.alpha.glass,
      borderColor: theme.custom.semantic.alpha.glassBorder,
      borderWidth: 1.5,
      borderRadius: theme.custom.metrics.radius.xxl,
    },
  };

  if (variant === 'default') {
    return (
      <Card
        {...rest}
        mode="contained"
        style={[styles.base, variantStyle.default, style]}
      >
        {children}
      </Card>
    );
  }

  return (
    <Card
      {...rest}
      mode="elevated"
      elevation={elevation ?? 2}
      style={[styles.base, variantStyle[variant], style]}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
