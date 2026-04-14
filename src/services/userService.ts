import { apiMain } from './api';

export const userService = {
  fetchUserProfile: async () => {
    const response = await apiMain.get('/users/me');
    return response.data;
  },
};
