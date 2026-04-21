import React, { useMemo } from 'react';
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

  const variantStyle = useMemo<ViewStyle>(() => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.custom.metrics.radius.xl,
        };
      case 'glass':
        return {
          backgroundColor: theme.custom.semantic.alpha.glass,
          borderColor: theme.custom.semantic.alpha.glassBorder,
          borderWidth: 1.5,
          borderRadius: theme.custom.metrics.radius.xxl,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.custom.metrics.radius.lg,
        };
    }
  }, [
    theme.colors.surface,
    theme.custom.metrics.radius.lg,
    theme.custom.metrics.radius.xl,
    theme.custom.metrics.radius.xxl,
    theme.custom.semantic.alpha.glass,
    theme.custom.semantic.alpha.glassBorder,
    variant,
  ]);
  const cardStyle = useMemo(
    () => [styles.base, variantStyle, style],
    [style, variantStyle],
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
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
