import React, { memo, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  style?: ViewStyle | ViewStyle[];
  action?: React.ReactNode;
};

export const SectionHeader = memo(
  ({ title, subtitle, align = 'left', style, action }: Props) => {
    const theme = useAppTheme();
    const containerStyle = useMemo(
      () => [
        styles.container,
        {
          marginBottom: theme.custom.metrics.spacing.lg,
          alignItems: align === 'center' ? 'center' : 'flex-start',
        },
        action ? styles.row : null,
        style,
      ],
      [action, align, style, theme.custom.metrics.spacing.lg],
    );
    const titleWrapStyle = useMemo(
      () => (action ? styles.titleWithAction : undefined),
      [action],
    );
    const subtitleStyle = useMemo(
      () => ({ marginTop: theme.custom.metrics.spacing.xs }),
      [theme.custom.metrics.spacing.xs],
    );

    return (
      <View style={containerStyle}>
        <View style={titleWrapStyle}>
          <AppText variant="headlineMedium" weight="heavy">
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="bodyMedium"
              tone="secondary"
              style={subtitleStyle}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        {action}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithAction: {
    flex: 1,
  },
});
