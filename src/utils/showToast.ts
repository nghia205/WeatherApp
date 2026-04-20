import Toast, { ToastShowParams } from 'react-native-toast-message';

type AppToastParams = Pick<ToastShowParams, 'text1' | 'text2' | 'onPress'>;

const showAppToast = (
  type: 'success' | 'error' | 'info',
  params: AppToastParams,
) => {
  Toast.show({
    type,
    text1: params.text1,
    text2: params.text2,
    onPress: params.onPress,
  });
};

export const showSuccessToast = (params: AppToastParams) => {
  showAppToast('success', params);
};

export const showErrorToast = (params: AppToastParams) => {
  showAppToast('error', params);
};

export const showInfoToast = (params: AppToastParams) => {
  showAppToast('info', params);
};
