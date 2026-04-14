import { apiWeather } from './api';

const API_KEY = '66cbeb4d7d94488cc33990fe9a29a188'; // chỉ đang dùng tạm, sau gọi qua proxy sever để ẩn API key

export const weatherService = {
  getWeatherByCity: async (city: string) => {
    const response = await apiWeather.get(
      `/data/2.5/weather?q=${city}&units=metric&lang=vi&appid=${API_KEY}`
    );
    return response.data;
  },
};
