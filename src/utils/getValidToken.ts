import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import Toast from 'react-native-toast-message';
import { authService } from '../services/authService';

// Khai báo biến quản lý hàng đợi ra ngoài cùng
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Hàm trung tâm: Chỉ làm đúng 1 việc là cấp token hợp lệ
const getValidToken = async () => {
  // Nếu có người khác đang refresh rồi, thì xếp hàng chờ lấy ké kết quả
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    const responseData = await authService.refreshToken(refreshToken);
    const refreshTokenData = responseData.data;

    // Lưu vào store
    useAuthStore.getState().login({
      user: refreshTokenData,
      token: refreshTokenData.access_token,
      tokenExpires: refreshTokenData.expires,
      refreshToken: refreshTokenData.refresh_token,
    });

    const newAccessToken = refreshTokenData.accessToken;
    // Giải phóng hàng đợi, trả về token mới cho những người đang chờ
    processQueue(null, newAccessToken.access_token);
    return newAccessToken.access_token;
  } catch (error) {
    processQueue(error, null);

    Toast.show({
      type: 'error',
      text1: 'Phiên đăng nhập hết hạn',
      text2: 'Vui lòng đăng nhập lại',
    });
    useAuthStore.getState().logout();

    throw error;
  } finally {
    isRefreshing = false;
  }
};

export { getValidToken };
