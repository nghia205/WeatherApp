import { create } from 'zustand';
import { userService } from '../services/userService';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>(set => ({
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.fetchUserProfile();
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to load user',
        isLoading: false,
      });
    }
  },
}));
