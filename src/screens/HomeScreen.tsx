import React, { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useWeatherStore } from '../store/useWeatherStore';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppDivider } from '../components/ui/AppDivider';
import { AppSearchInput } from '../components/ui/AppSearchInput';
import { AppText } from '../components/ui/AppText';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ScreenError } from '../components/feedback/ScreenError';
import { ScreenLoading } from '../components/feedback/ScreenLoading';
import { useAppTheme } from '../theme/useAppTheme';

const HomeScreen = () => {
  const [cityInput, setCityInput] = useState('');
  const { weather, loading, error, fetchWeather } = useWeatherStore();
  const theme = useAppTheme();

  const handleSearch = () => {
    if (cityInput.trim()) {
      Keyboard.dismiss();
      fetchWeather(cityInput.trim());
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader
          title="🌤 Thời tiết"
          subtitle="Tra cứu thời tiết mọi lúc, mọi nơi"
          align="center"
          style={styles.header}
        />

        <AppSearchInput
          placeholder="Nhập thành phố..."
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
        />

        {loading ? <ScreenLoading message="Đang tải dữ liệu..." /> : null}

        {!loading && error ? <ScreenError message={error} /> : null}

        {weather && !loading && !error ? (
          <AppCard variant="elevated" style={styles.resultCard}>
            <View style={styles.resultCardContent}>
              <AppText
                variant="headlineMedium"
                weight="heavy"
                style={styles.cityName}
              >
                {weather.name}
              </AppText>

              <AppText
                variant="bodyLarge"
                tone="secondary"
                style={styles.description}
              >
                {weather.weather[0].description}
              </AppText>

              <AppText
                variant="displayLarge"
                weight="bold"
                style={[styles.temperature, { color: theme.colors.primary }]}
              >
                {Math.round(weather.main.temp)}°C
              </AppText>

              <AppDivider style={styles.divider} />

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="water-percent"
                    iconColor={theme.colors.tertiary}
                    size={28}
                  />
                  <AppText variant="titleMedium" weight="bold">
                    {weather.main.humidity}%
                  </AppText>
                  <AppText variant="labelMedium" tone="muted">
                    Độ ẩm
                  </AppText>
                </View>

                <AppDivider vertical style={styles.verticalDivider} />

                <View style={styles.detailItem}>
                  <IconButton
                    icon="weather-windy"
                    iconColor={theme.colors.tertiary}
                    size={28}
                  />
                  <AppText variant="titleMedium" weight="bold">
                    {weather.wind.speed} m/s
                  </AppText>
                  <AppText variant="labelMedium" tone="muted">
                    Tốc độ gió
                  </AppText>
                </View>
              </View>
            </View>
          </AppCard>
        ) : null}
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
  },
  resultCard: {
    marginTop: 8,
  },
  resultCardContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cityName: {
    letterSpacing: 0.5,
  },
  description: {
    marginTop: 4,
    opacity: 0.85,
    textTransform: 'capitalize',
    fontStyle: 'italic',
  },
  temperature: {
    marginVertical: 16,
  },
  divider: {
    marginVertical: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    marginHorizontal: 12,
  },
});

export default HomeScreen;
