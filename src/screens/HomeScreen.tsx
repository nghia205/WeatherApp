import React, { useState } from 'react';
import { View, Keyboard, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Searchbar,
  ActivityIndicator,
  Card,
  useTheme,
  IconButton,
  Surface,
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            🌤 Thời tiết
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
            Tra cứu thời tiết mọi lúc, mọi nơi
          </Text>
        </View>

        {/* Search */}
        <Searchbar
          placeholder="Nhập thành phố..."
          onChangeText={setCityInput}
          value={cityInput}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
          style={styles.searchBar}
          elevation={2}
        />

        {/* Loading */}
        {loading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 12, color: theme.colors.secondary }}>Đang tải dữ liệu...</Text>
          </View>
        )}

        {/* Error */}
        {error && !loading && (
          <Surface style={styles.errorSurface} elevation={1}>
            <IconButton icon="alert-circle-outline" iconColor={theme.colors.error} size={32} />
            <Text variant="titleMedium" style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </Surface>
        )}

        {/* Result */}
        {weather && !loading && !error && (
          <Card style={styles.resultCard} mode="elevated" elevation={4}>
            <Card.Content style={styles.resultCardContent}>
              <Text variant="headlineMedium" style={[styles.cityName, { color: theme.colors.onSurface }]}>
                {weather.name}
              </Text>
              
              <Text variant="bodyLarge" style={styles.description}>
                {weather.weather[0].description}
              </Text>

              <Text variant="displayLarge" style={[styles.temperature, { color: theme.colors.primary }]}>
                {Math.round(weather.main.temp)}°C
              </Text>

              <View style={styles.divider} />

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <IconButton icon="water-percent" iconColor={theme.colors.tertiary} size={28} />
                  <Text variant="titleMedium">{weather.main.humidity}%</Text>
                  <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Độ ẩm</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.detailItem}>
                  <IconButton icon="weather-windy" iconColor={theme.colors.tertiary} size={28} />
                  <Text variant="titleMedium">{weather.wind.speed} m/s</Text>
                  <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Tốc độ gió</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    marginVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchBar: {
    marginBottom: 32,
    borderRadius: 16,
  },
  centerContent: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorSurface: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 8,
  },
  resultCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  resultCardContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cityName: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  description: {
    fontStyle: 'italic',
    textTransform: 'capitalize',
    marginTop: 4,
    opacity: 0.8,
  },
  temperature: {
    fontWeight: 'bold',
    marginVertical: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    opacity: 0.5,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
});

export default HomeScreen;
