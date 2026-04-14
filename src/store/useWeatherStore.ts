import { create } from 'zustand';
import { removeVietnameseTones } from '../utils/removeVietnameseTones';
import { weatherService } from '../services/weatherService';

interface WeatherState {
  weather: any;
  loading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>(set => ({
  weather: null,
  loading: false,
  error: null,
  fetchWeather: async (cityInput: string) => {
    const city = encodeURIComponent(removeVietnameseTones(cityInput));
    set({ loading: true, error: null });
    try {
      const data = await weatherService.getWeatherByCity(city);
      set({ weather: data, loading: false });
    } catch (err) {
      set({ error: 'Không tìm thấy thành phố', loading: false });
    }
  },
}));
