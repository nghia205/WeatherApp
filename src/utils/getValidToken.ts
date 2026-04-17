import Toast from 'react-native-toast-message';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

type RefreshQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  refreshQueue.forEach(pendingRequest => {
    if (error) {
      pendingRequest.reject(error);
      return;
    }

    pendingRequest.resolve(token);
  });

  refreshQueue = [];
};

// Returns one fresh access token and shares that result with any requests that hit token expiry at the same time.
const getValidToken = async () => {
  if (isRefreshing) {
    return new Promise<string | null>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    const responseData = await authService.refreshToken(refreshToken);
    const refreshTokenData = responseData.data;

    useAuthStore.getState().login({
      user: refreshTokenData,
      token: refreshTokenData.access_token,
      tokenExpires: refreshTokenData.expires,
      refreshToken: refreshTokenData.refresh_token,
    });

    const newAccessToken = refreshTokenData.access_token;
    processQueue(null, newAccessToken);

    return newAccessToken;
  } catch (error) {
    processQueue(error, null);

    Toast.show({
      type: 'error',
      text1: 'Your session has expired',
      text2: 'Please sign in again',
    });
    useAuthStore.getState().logout();

    throw error;
  } finally {
    isRefreshing = false;
  }
};

export { getValidToken };
