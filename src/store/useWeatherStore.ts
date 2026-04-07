import { create } from 'zustand';
import axios from 'axios';

interface WeatherState {
  weather: any;
  loading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
}

const API_KEY = '31eb2ea5c88de466a01a8fd74fc0a788'; // chỉ đang dùng tạm, sau gọi qua proxy sever để ẩn API key

export const useWeatherStore = create<WeatherState>(set => ({
  weather: null,
  loading: false,
  error: null,
  fetchWeather: async (city: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=vi&appid=${API_KEY}`,
      );
      set({ weather: response.data, loading: false });
    } catch (err) {
      set({ error: 'Không tìm thấy thành phố', loading: false });
    }
  },
}));
