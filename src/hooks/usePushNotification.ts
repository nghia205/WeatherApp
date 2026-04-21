import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate } from '../navigation/navigationRef';

const PUSH_PERMISSION_PROMPT_STATUS_KEY =
  'push_notification_permission_prompt_status';
const PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY =
  'push_notification_permission_prompt_skipped_at';
const PUSH_PERMISSION_PROMPT_SKIP_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

type PushPermissionPromptStatus = 'allowed' | 'denied' | 'skipped';

const isMessagingPermissionEnabled = (authStatus: number) =>
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus === messaging.AuthorizationStatus.PROVISIONAL;

export const usePushNotification = () => {
  const [permissionPromptVisible, setPermissionPromptVisible] = useState(false);
  const [permissionRequesting, setPermissionRequesting] = useState(false);

  const checkUserPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }

      return true;
    }

    const authStatus = await messaging().hasPermission();
    return isMessagingPermissionEnabled(authStatus);
  }, []);

  const requestUserPermission = useCallback(async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (Platform.OS === 'android') {
      return true;
    }

    const authStatus = await messaging().requestPermission();
    return isMessagingPermissionEnabled(authStatus);
  }, []);

  const fetchAndSaveToken = useCallback(async () => {
    try {
      // Send this token to the backend when the API is available.
      await messaging().getToken();
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  }, []);

  const handleAllowNotifications = useCallback(async () => {
    setPermissionRequesting(true);

    try {
      const hasPermission = await requestUserPermission();
      setPermissionPromptVisible(false);

      if (hasPermission) {
        await AsyncStorage.setItem(
          PUSH_PERMISSION_PROMPT_STATUS_KEY,
          'allowed',
        );
        await AsyncStorage.removeItem(PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY);
        await fetchAndSaveToken();
      } else {
        await AsyncStorage.setItem(
          PUSH_PERMISSION_PROMPT_STATUS_KEY,
          'denied',
        );
        await AsyncStorage.removeItem(PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY);
      }
    } finally {
      setPermissionRequesting(false);
    }
  }, [fetchAndSaveToken, requestUserPermission]);

  const handleSkipNotifications = useCallback(async () => {
    await AsyncStorage.setItem(PUSH_PERMISSION_PROMPT_STATUS_KEY, 'skipped');
    await AsyncStorage.setItem(
      PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY,
      Date.now().toString(),
    );
    setPermissionPromptVisible(false);
  }, []);

  const promptForNotificationPermission = useCallback(async () => {
    if (permissionPromptVisible || permissionRequesting) {
      return;
    }

    const hasPermission = await checkUserPermission();

    if (hasPermission) {
      await AsyncStorage.setItem(PUSH_PERMISSION_PROMPT_STATUS_KEY, 'allowed');
      await AsyncStorage.removeItem(PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY);
      await fetchAndSaveToken();
      return;
    }

    const status = (await AsyncStorage.getItem(
      PUSH_PERMISSION_PROMPT_STATUS_KEY,
    )) as PushPermissionPromptStatus | null;
    const skippedAtValue = await AsyncStorage.getItem(
      PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY,
    );
    const skippedAt = Number(skippedAtValue);
    const canShowSkippedPrompt =
      status === 'skipped' &&
      (!skippedAt ||
        Date.now() - skippedAt >= PUSH_PERMISSION_PROMPT_SKIP_COOLDOWN_MS);

    if (status === 'allowed' || status === null || canShowSkippedPrompt) {
      setPermissionPromptVisible(true);
    }
  }, [
    checkUserPermission,
    fetchAndSaveToken,
    permissionPromptVisible,
    permissionRequesting,
  ]);

  useEffect(() => {
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type !== EventType.PRESS) {
          return;
        }

        const data = detail.notification?.data;
        if (data && data.screen) {
          navigate(data.screen as string, { id: data.id });
        }
      },
    );

    return () => {
      unsubscribeForegroundEvent();
    };
  }, []);

  useEffect(() => {
    const setupPushNotification = async () => {
      const hasPermission = await checkUserPermission();

      if (hasPermission) {
        await AsyncStorage.setItem(
          PUSH_PERMISSION_PROMPT_STATUS_KEY,
          'allowed',
        );
        await AsyncStorage.removeItem(PUSH_PERMISSION_PROMPT_SKIPPED_AT_KEY);
        await fetchAndSaveToken();
      }
    };

    setupPushNotification();

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(() => {
      // Send the refreshed token to the backend when the API is available.
    });

    // Render foreground push messages with a local notification.
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const channelId = await notifee.createChannel({
        id: 'weather_alerts',
        name: 'Cảnh báo thời tiết',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Thông báo mới',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeOnMessage();
    };
  }, [checkUserPermission, fetchAndSaveToken]);

  return {
    permissionPromptVisible,
    permissionRequesting,
    handleAllowNotifications,
    handleSkipNotifications,
    promptForNotificationPermission,
  };
};
