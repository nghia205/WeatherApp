import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWeatherStore } from '../store/useWeatherStore';

const Weather = () => {
  const insets = useSafeAreaInsets();
  const [cityInput, setCityInput] = useState('');
  const { weather, loading, error, fetchWeather } = useWeatherStore();

  const handleSearch = () => {
    if (cityInput.trim()) {
      Keyboard.dismiss();
      fetchWeather(cityInput);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Text style={styles.title}>🌤 Weather</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Nhập thành phố..."
          placeholderTextColor="#999"
          value={cityInput}
          onSubmitEditing={handleSearch}
          onChangeText={setCityInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#fff" />}

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Result */}
      {weather && !loading && !error && (
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.name}</Text>

          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>

          <Text style={styles.desc}>{weather.weather[0].description}</Text>

          <View style={styles.extraInfo}>
            <Text>💧 {weather.main.humidity}%</Text>
            <Text>🌬 {weather.wind.speed} m/s</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#4facfe',
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginVertical: 20,
  },

  searchBox: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },

  button: {
    marginLeft: 10,
    backgroundColor: '#222',
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    marginTop: 40,
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  temp: {
    fontSize: 60,
    fontWeight: '200',
    color: '#ff7a00',
  },

  desc: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    textTransform: 'capitalize',
  },

  extraInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },

  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});
