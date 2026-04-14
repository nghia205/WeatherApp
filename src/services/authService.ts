import { apiMain } from './api';

export const authService = {
  login: async (credentials: Record<string, any>) => {
    const response = await apiMain.post('/auth/login', credentials);
    return response.data;
  },
};
