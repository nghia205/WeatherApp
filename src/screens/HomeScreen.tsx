import React, { useState } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native'; // Thêm StyleSheet
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  useTheme,
} from 'react-native-paper';
import { useWeatherStore } from '../store/useWeatherStore';
import { ScreenContainer } from '../components/ScreenContainer';

const HomeScreen = ({ navigation }: any) => {
  const [cityInput, setCityInput] = useState('');
  const { weather, loading, error, fetchWeather } = useWeatherStore();
  const theme = useTheme();

  const handleSearch = () => {
    if (cityInput.trim()) {
      Keyboard.dismiss();
      fetchWeather(cityInput);
    }
  };

  return (
    <ScreenContainer>
      <Text variant="displayMedium" style={styles.title}>
        🌤 Weather
      </Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Nhập thành phố..."
          value={cityInput}
          onSubmitEditing={handleSearch}
          onChangeText={setCityInput}
          style={styles.searchInput}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
        >
          Tìm
        </Button>
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {/* Error */}
      {error && (
        <Text
          variant="bodyLarge"
          style={[styles.errorText, { color: theme.colors.error }]}
        >
          {error}
        </Text>
      )}

      {/* Result */}
      {weather && !loading && !error && (
        <Card style={styles.resultCard}>
          <Card.Content style={styles.resultCardContent}>
            <Text variant="headlineMedium" style={styles.cityName}>
              {weather.name}
            </Text>

            {/* Vẫn giữ inline cho những style phụ thuộc trực tiếp vào Theme (Dynamic Value) */}
            <Text
              variant="displayLarge"
              style={[styles.temperature, { color: theme.colors.primary }]}
            >
              {Math.round(weather.main.temp)}°C
            </Text>

            <Text variant="titleMedium" style={styles.description}>
              {weather.weather[0].description}
            </Text>

            <View style={styles.detailsContainer}>
              <Text variant="bodyLarge">💧 {weather.main.humidity}%</Text>
              <Text variant="bodyLarge">🌬 {weather.wind.speed} m/s</Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScreenContainer>
  );
};

// Chuẩn Production: Đưa hết định dạng tĩnh xuống đây
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    justifyContent: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
  },
  resultCard: {
    marginTop: 20,
    padding: 10,
  },
  resultCardContent: {
    alignItems: 'center',
  },
  cityName: {
    fontWeight: 'bold',
  },
  temperature: {
    marginVertical: 10,
  },
  description: {
    fontStyle: 'italic',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
});

export default HomeScreen;
