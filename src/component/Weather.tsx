import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useWeatherStore } from '../store/useWeatherStore';

const Weather = () => {
  const [cityInput, setCityInput] = useState('');
  const { weather, loading, error, fetchWeather } = useWeatherStore();

  const handleSearch = () => {
    if (cityInput.trim()) {
      fetchWeather(cityInput);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Weather App 0.81</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên thành phố (vd: Hue, Hanoi...)"
          value={cityInput}
          onChangeText={setCityInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {weather && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchBox: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
  },
  cityName: { fontSize: 30, fontWeight: 'bold' },
  temp: { fontSize: 50, color: '#ff4500' },
  desc: { fontSize: 18, fontStyle: 'italic', textTransform: 'capitalize' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Weather;
