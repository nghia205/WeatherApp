import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../ui/AppText';

type Props = {
  message?: string;
};

export const ScreenEmpty = ({ message = 'No data available' }: Props) => {
  return (
    <View style={styles.container}>
      <AppText variant="bodyMedium" tone="muted">
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
