import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  useTheme,
} from 'react-native-paper';
import { useWeatherStore } from '../store/useWeatherStore';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <Text
        variant="displayMedium"
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontWeight: 'bold',
        }}
      >
        🌤 Weather
      </Text>

      {/* Search */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          mode="outlined"
          placeholder="Nhập thành phố..."
          value={cityInput}
          onSubmitEditing={handleSearch}
          onChangeText={setCityInput}
          style={{ flex: 1, marginRight: 10 }}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={{ justifyContent: 'center' }}
        >
          Tìm
        </Button>
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Error */}
      {error && (
        <Text
          variant="bodyLarge"
          style={{
            color: theme.colors.error,
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {error}
        </Text>
      )}

      {/* Result */}
      {weather && !loading && !error && (
        <Card style={{ marginTop: 20, padding: 10 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
              {weather.name}
            </Text>
            <Text
              variant="displayLarge"
              style={{ color: theme.colors.primary, marginVertical: 10 }}
            >
              {Math.round(weather.main.temp)}°C
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontStyle: 'italic',
                marginBottom: 10,
                textTransform: 'capitalize',
              }}
            >
              {weather.weather[0].description}
            </Text>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
              <Text variant="bodyLarge">💧 {weather.main.humidity}%</Text>
              <Text variant="bodyLarge">🌬 {weather.wind.speed} m/s</Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScreenContainer>
  );
};

export default HomeScreen;
