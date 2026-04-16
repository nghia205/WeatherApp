import React from 'react';
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

export const SectionHeader = ({
  title,
  subtitle,
  align = 'left',
  style,
  action,
}: Props) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: theme.custom.metrics.spacing.lg,
          alignItems: align === 'center' ? 'center' : 'flex-start',
        },
        action ? styles.row : null,
        style,
      ]}
    >
      <View style={action ? { flex: 1 } : undefined}>
        <AppText variant="headlineMedium" weight="heavy">
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="bodyMedium"
            tone="secondary"
            style={{ marginTop: theme.custom.metrics.spacing.xs }}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
