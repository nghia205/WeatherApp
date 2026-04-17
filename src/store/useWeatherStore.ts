import { create } from 'zustand';
import { removeVietnameseTones } from '../utils/removeVietnameseTones';
import { weatherService, WeatherLocation } from '../services/weatherService';

interface WeatherState {
  weather: any;
  location: WeatherLocation | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>(set => ({
  weather: null,
  location: null,
  loading: false,
  error: null,
  fetchWeather: async (cityInput: string) => {
    const city = removeVietnameseTones(cityInput.trim());

    set({ loading: true, error: null });

    try {
      const location = await weatherService.resolveLocation(city);
      const data = await weatherService.getWeatherByCoordinates(
        location.lat,
        location.lon,
      );

      set({ weather: data, location, loading: false });
    } catch {
      set({ error: 'City not found', loading: false });
    }
  },
}));
