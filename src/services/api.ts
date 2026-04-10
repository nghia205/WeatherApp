import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// 1. Tạo một hàm dùng chung để "bơm" (inject) Interceptors vào bất kỳ Axios Instance nào
const withInterceptors = (axiosInstance: any) => {
  // Request Interceptor
  axiosInstance.interceptors.request.use(async (config: any) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response && error.response.status === 401) {
        const logout = useAuthStore.getState().logout;
        logout();
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

// 2. Tạo các Instances khác nhau tuỳ mục đích sử dụng
export const apiMain = withInterceptors(
  axios.create({
    baseURL: 'https://silvatek.vn:8080',
  }),
);

export const apiWeather = axios.create({
  baseURL: 'https://api.openweathermap.org',
});
