import React, { memo, useMemo } from 'react';
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

export const AppCard = memo(
  ({ variant = 'default', style, children, elevation, ...rest }: Props) => {
    const theme = useAppTheme();

    const variantStyle = useMemo<Record<Variant, ViewStyle>>(
      () => ({
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
      }),
      [
        theme.colors.surface,
        theme.custom.metrics.radius.lg,
        theme.custom.metrics.radius.xl,
        theme.custom.metrics.radius.xxl,
        theme.custom.semantic.alpha.glass,
        theme.custom.semantic.alpha.glassBorder,
      ],
    );
    const cardStyle = useMemo(
      () => [styles.base, variantStyle[variant], style],
      [style, variant, variantStyle],
    );

    if (variant === 'default') {
      return (
        <Card {...rest} mode="contained" style={cardStyle}>
          {children}
        </Card>
      );
    }

    return (
      <Card
        {...rest}
        mode="elevated"
        elevation={elevation ?? 2}
        style={cardStyle}
      >
        {children}
      </Card>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
