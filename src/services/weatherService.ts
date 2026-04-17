import { apiWeather } from './api';

const API_KEY = '66cbeb4d7d94488cc33990fe9a29a188';

export type WeatherLocation = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
};

export const weatherService = {
  resolveLocation: async (city: string): Promise<WeatherLocation> => {
    const response = await apiWeather.get('/geo/1.0/direct', {
      params: {
        q: city,
        limit: 1,
        appid: API_KEY,
      },
    });

    const [location] = response.data;

    if (!location) {
      throw new Error('City not found');
    }

    return location;
  },
  getWeatherByCoordinates: async (lat: number, lon: number) => {
    const response = await apiWeather.get('/data/2.5/weather', {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: 'en',
        appid: API_KEY,
      },
    });

    return response.data;
  },
};
