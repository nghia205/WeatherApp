import { create } from 'zustand';
import { removeVietnameseTones } from '../utils/removeVietnameseTones';
import { apiWeather } from '../services/api';

interface WeatherState {
  weather: any;
  loading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
}

const API_KEY = '66cbeb4d7d94488cc33990fe9a29a188'; // chỉ đang dùng tạm, sau gọi qua proxy sever để ẩn API key

export const useWeatherStore = create<WeatherState>(set => ({
  weather: null,
  loading: false,
  error: null,
  fetchWeather: async (cityInput: string) => {
    const city = encodeURIComponent(removeVietnameseTones(cityInput));
    set({ loading: true, error: null });
    try {
      const response = await apiWeather.get(
        `/data/2.5/weather?q=${city}&units=metric&lang=vi&appid=${API_KEY}`,
      );
      set({ weather: response.data, loading: false });
    } catch (err) {
      set({ error: 'Không tìm thấy thành phố', loading: false });
    }
  },
}));
