import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string | number;
  email: string;
  name?: string;
}

interface LoginPayload {
  user: User;
  token: string;
  tokenExpires: number;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAppLoading: boolean;
  tokenExpires: number;
  refreshToken: string | null;

  login: (payload: LoginPayload) => void;
  logout: () => void;
  setAppReady: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAppLoading: true,
      tokenExpires: 0,
      refreshToken: null,

      // Persists the authenticated session and stores the absolute token expiry time.
      login: ({ user, token, tokenExpires, refreshToken }) => {
        const expirationTime = Date.now() + tokenExpires;
        set({
          user,
          token,
          tokenExpires: expirationTime,
          refreshToken,
        });
      },

      // Clears local auth state after sign-out or a failed token refresh.
      logout: () => {
        set({ user: null, token: null });
      },

      // Unlocks navigation after the persisted session has been validated.
      setAppReady: () => {
        set({ isAppLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
        tokenExpires: state.tokenExpires,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
