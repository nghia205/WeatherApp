import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Surface, Text } from 'react-native-paper';
import { AppButton } from '../ui/AppButton';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  visible: boolean;
  requesting: boolean;
  onAllow: () => void;
  onSkip: () => void;
};

export const NotificationPermissionPrompt = memo(
  ({ visible, requesting, onAllow, onSkip }: Props) => {
    const theme = useAppTheme();

    return (
      <Portal>
        <Modal
          visible={visible}
          dismissable={!requesting}
          onDismiss={onSkip}
          contentContainerStyle={styles.modal}
        >
          <Surface
            elevation={3}
            style={[
              styles.container,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.custom.semantic.border.subtle,
              },
            ]}
          >
            <Text
              variant="titleLarge"
              style={[
                styles.title,
                { color: theme.custom.semantic.text.primary },
              ]}
            >
              Bật cảnh báo thời tiết
            </Text>

            <Text
              variant="bodyMedium"
              style={[
                styles.description,
                { color: theme.custom.semantic.text.secondary },
              ]}
            >
              Ứng dụng cần quyền thông báo để gửi cảnh báo mưa lớn, bão hoặc
              thời tiết nguy hiểm. Ở bước tiếp theo, hệ thống sẽ hỏi bạn cấp
              quyền này.
            </Text>

            <View style={styles.actions}>
              <AppButton
                loading={requesting}
                disabled={requesting}
                onPress={onAllow}
              >
                Bật cảnh báo thời tiết
              </AppButton>

              <AppButton variant="ghost" disabled={requesting} onPress={onSkip}>
                Để sau
              </AppButton>
            </View>
          </Surface>
        </Modal>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 24,
  },
  container: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    letterSpacing: 0,
    lineHeight: 22,
    marginBottom: 22,
    textAlign: 'center',
  },
  actions: {
    gap: 8,
  },
});
