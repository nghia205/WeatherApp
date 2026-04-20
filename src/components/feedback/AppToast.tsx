import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

import { AppText } from '../ui/AppText';
import { useAppTheme } from '../../theme/useAppTheme';

type ToastKind = 'success' | 'error' | 'info';

type ToastCardProps = ToastConfigParams<any> & {
  kind: ToastKind;
};

const getToastTone = (kind: ToastKind) => {
  switch (kind) {
    case 'success':
      return {
        icon: 'check-circle-outline',
        accent: '#16A34A',
        bg: '#ECFDF3',
        text: '#14532D',
      };
    case 'error':
      return {
        icon: 'alert-circle-outline',
        accent: '#DC2626',
        bg: '#FEF2F2',
        text: '#7F1D1D',
      };
    case 'info':
    default:
      return {
        icon: 'information-outline',
        accent: '#2563EB',
        bg: '#EFF6FF',
        text: '#1E3A8A',
      };
  }
};

const ToastCard = memo(({ text1, text2, kind, onPress }: ToastCardProps) => {
  const theme = useAppTheme();
  const tone = useMemo(() => getToastTone(kind), [kind]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: theme.dark ? theme.colors.surface : tone.bg,
        borderColor: theme.dark
          ? theme.custom.semantic.border.subtle
          : tone.accent,
        borderRadius: theme.custom.metrics.radius.md,
      },
    ],
    [
      theme.colors.surface,
      theme.custom.metrics.radius.md,
      theme.custom.semantic.border.subtle,
      theme.dark,
      tone.accent,
      tone.bg,
    ],
  );
  const accentStyle = useMemo(
    () => [styles.accent, { backgroundColor: tone.accent }],
    [tone.accent],
  );
  const iconWrapStyle = useMemo(
    () => [
      styles.iconWrap,
      {
        backgroundColor: theme.dark
          ? theme.colors.surfaceVariant
          : `${tone.accent}1A`,
      },
    ],
    [theme.colors.surfaceVariant, theme.dark, tone.accent],
  );
  const titleStyle = useMemo(
    () => [
      styles.title,
      {
        color: theme.dark ? theme.custom.semantic.text.primary : tone.text,
      },
    ],
    [theme.custom.semantic.text.primary, theme.dark, tone.text],
  );
  const messageStyle = useMemo(
    () => [
      styles.message,
      {
        color: theme.dark
          ? theme.custom.semantic.text.secondary
          : theme.custom.semantic.text.secondary,
      },
    ],
    [theme.custom.semantic.text.secondary, theme.dark],
  );

  return (
    <Surface
      elevation={4}
      onTouchEnd={onPress}
      style={containerStyle}
      testID={`toast-${kind}`}
    >
      <View style={accentStyle} />
      <View style={iconWrapStyle}>
        <IconButton
          icon={tone.icon}
          iconColor={tone.accent}
          size={22}
          style={styles.icon}
        />
      </View>
      <View style={styles.copy}>
        {text1 ? (
          <AppText variant="titleSmall" weight="bold" style={titleStyle}>
            {text1}
          </AppText>
        ) : null}
        {text2 ? (
          <AppText variant="bodySmall" style={messageStyle}>
            {text2}
          </AppText>
        ) : null}
      </View>
    </Surface>
  );
});

const toastConfig: ToastConfig = {
  success: props => <ToastCard {...props} kind="success" />,
  error: props => <ToastCard {...props} kind="error" />,
  info: props => <ToastCard {...props} kind="info" />,
};

export const AppToast = memo(() => {
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={56}
      visibilityTime={3000}
      swipeable
    />
  );
});

const styles = StyleSheet.create({
  container: {
    width: '92%',
    minHeight: 68,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  accent: {
    alignSelf: 'stretch',
    width: 5,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    marginRight: 12,
  },
  icon: {
    margin: 0,
  },
  copy: {
    flex: 1,
    paddingRight: 16,
    paddingVertical: 12,
  },
  title: {
    marginBottom: 4,
  },
  message: {
    lineHeight: 18,
  },
});
