import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { getValidToken } from '../utils/getValidToken';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const withInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Retry one failed authenticated request after refreshing the access token.
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newToken = await getValidToken();

          axiosInstance.defaults.headers.common.Authorization =
            'Bearer ' + newToken;
          originalRequest.headers.Authorization = 'Bearer ' + newToken;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

const BASE_URL = 'https://silvatek.vn:8080';

export const apiPublic = axios.create({
  baseURL: BASE_URL,
});

export const apiMain = withInterceptors(
  axios.create({
    baseURL: BASE_URL,
  }),
);

export const apiWeather = axios.create({
  baseURL: 'https://api.openweathermap.org',
});
