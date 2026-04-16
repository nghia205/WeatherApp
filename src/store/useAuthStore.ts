import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Khai báo kiểu dữ liệu cho User
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

// Khai báo kiểu dữ liệu cho Store
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

      // Hàm gọi khi đăng nhập thành công
      login: ({ user, token, tokenExpires, refreshToken }) => {
        const expirationTime = Date.now() + tokenExpires;
        set({
          user,
          token,
          tokenExpires: expirationTime,
          refreshToken,
        });
      },

      // Hàm gọi khi đăng xuất hoặc token hết hạn (được gọi từ axios interceptor)
      logout: () => {
        set({ user: null, token: null });
      },

      // Hàm gọi khi đã hoàn tất việc kiểm tra lúc app mới khởi động
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
