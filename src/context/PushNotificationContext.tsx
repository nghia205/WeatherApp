import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { NotificationPermissionPrompt } from '../components/feedback/NotificationPermissionPrompt';
import { usePushNotification } from '../hooks/usePushNotification';

type PushNotificationContextValue = {
  promptForNotificationPermission: () => Promise<void>;
};

const PushNotificationContext =
  createContext<PushNotificationContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export const PushNotificationProvider = ({ children }: Props) => {
  const {
    permissionPromptVisible,
    permissionRequesting,
    handleAllowNotifications,
    handleSkipNotifications,
    promptForNotificationPermission,
  } = usePushNotification();

  const value = useMemo(
    () => ({ promptForNotificationPermission }),
    [promptForNotificationPermission],
  );

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
      <NotificationPermissionPrompt
        visible={permissionPromptVisible}
        requesting={permissionRequesting}
        onAllow={handleAllowNotifications}
        onSkip={handleSkipNotifications}
      />
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationPrompt = () => {
  const context = useContext(PushNotificationContext);

  if (!context) {
    throw new Error(
      'usePushNotificationPrompt must be used within PushNotificationProvider',
    );
  }

  return context;
};
