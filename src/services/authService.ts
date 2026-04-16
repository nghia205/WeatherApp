import { apiPublic } from './api';

export const authService = {
  login: async (credentials: Record<string, any>) => {
    const response = await apiPublic.post('/auth/login', credentials);
    return response.data;
  },
  refreshToken: async (refreshToken: string | null) => {
    const response = await apiPublic.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
