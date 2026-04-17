import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  type?: 'error' | 'info';
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const InlineFeedback = ({
  type = 'error',
  title,
  message,
  actionLabel,
  onAction,
}: Props) => {
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
      {actionLabel && onAction ? (
        <AppButton
          variant="secondary"
          fullWidth={false}
          onPress={onAction}
          style={styles.action}
        >
          {actionLabel}
        </AppButton>
      ) : null}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    marginTop: 12,
  },
});
