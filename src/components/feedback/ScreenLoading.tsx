import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AppText } from '../ui/AppText';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  message?: string;
};

export const ScreenLoading = ({ message = 'Đang tải dữ liệu...' }: Props) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText variant="bodyMedium" tone="secondary" style={{ marginTop: 12 }}>
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
