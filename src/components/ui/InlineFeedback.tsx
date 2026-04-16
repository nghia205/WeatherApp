import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';
import { AppText } from './AppText';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  type?: 'error' | 'info';
  title?: string;
  message: string;
};

export const InlineFeedback = ({ type = 'error', title, message }: Props) => {
  const theme = useAppTheme();

  const config =
    type === 'error'
      ? {
          icon: 'alert-circle-outline',
          bg: theme.custom.semantic.feedback.errorBg,
          text: theme.custom.semantic.feedback.errorText,
        }
      : {
          icon: 'information-outline',
          bg: theme.custom.semantic.feedback.infoBg,
          text: theme.custom.semantic.feedback.infoText,
        };

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderRadius: theme.custom.metrics.radius.md,
        },
      ]}
      elevation={1}
    >
      <IconButton icon={config.icon} iconColor={config.text} size={28} />
      {title ? (
        <AppText
          variant="titleMedium"
          weight="bold"
          style={{ color: config.text, textAlign: 'center' }}
        >
          {title}
        </AppText>
      ) : null}
      <AppText
        variant="bodyMedium"
        style={{
          color: config.text,
          textAlign: 'center',
          marginTop: title ? 6 : 0,
        }}
      >
        {message}
      </AppText>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
