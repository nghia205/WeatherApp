import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useWeatherStore } from '../store/useWeatherStore';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppDivider } from '../components/ui/AppDivider';
import { AppTextInput } from '../components/ui/AppTextInput';
import { AppText } from '../components/ui/AppText';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ScreenError } from '../components/feedback/ScreenError';
import { ScreenLoading } from '../components/feedback/ScreenLoading';
import { useAppTheme } from '../theme/useAppTheme';

const QUICK_CITIES = ['Hanoi', 'Da Nang', 'Ho Chi Minh City'];

const getWeatherIconUrl = (icon?: string) => {
  return `https://openweathermap.org/img/wn/${icon || '02d'}@4x.png`;
};

const formatVisibility = (visibility?: number) => {
  if (!visibility) return 'N/A';

  return `${(visibility / 1000).toFixed(1)} km`;
};

const HomeScreen = () => {
  const [cityInput, setCityInput] = useState('');
  const { weather, location, loading, error, fetchWeather } = useWeatherStore();
  const theme = useAppTheme();

  const handleSearch = (city = cityInput) => {
    if (city.trim()) {
      Keyboard.dismiss();
      setCityInput(city);
      fetchWeather(city.trim());
    }
  };

  const weatherIcon = weather?.weather?.[0]?.icon;
  const weatherDescription = weather?.weather?.[0]?.description;
  const locationTitle = location
    ? `${location.name}${location.country ? `, ${location.country}` : ''}`
    : weather?.name;

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Weather"
          subtitle="Search current conditions by city"
          style={styles.header}
        />

        <View
          style={[
            styles.searchPanel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.custom.semantic.border.subtle,
            },
          ]}
        >
          <AppTextInput
            variant="search"
            placeholder="Enter a city..."
            value={cityInput}
            onChangeText={setCityInput}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            style={styles.searchInput}
          />

          <AppButton
            variant="primary"
            icon="magnify"
            onPress={() => handleSearch()}
          >
            Search
          </AppButton>
        </View>

        <View style={styles.quickCityRow}>
          {QUICK_CITIES.map(city => (
            <AppButton
              key={city}
              variant="secondary"
              compact
              fullWidth={false}
              onPress={() => handleSearch(city)}
            >
              {city}
            </AppButton>
          ))}
        </View>

        {loading ? <ScreenLoading message="Loading weather..." /> : null}

        {!loading && error ? (
          <ScreenError
            message={error}
            onRetry={() => handleSearch()}
            actionLabel="Try again"
          />
        ) : null}

        {!loading && !error && weather ? (
          <>
            <AppCard variant="elevated" style={styles.resultCard}>
              <View style={styles.resultCardContent}>
                <View style={styles.weatherSummaryRow}>
                  <View style={styles.summaryText}>
                    <AppText variant="headlineMedium" weight="heavy">
                      {locationTitle}
                    </AppText>

                    <AppText
                      variant="bodyLarge"
                      tone="secondary"
                      style={styles.description}
                    >
                      {weatherDescription || 'Current conditions'}
                    </AppText>

                    <AppText
                      variant="displayLarge"
                      weight="bold"
                      style={[
                        styles.temperature,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {Math.round(weather.main.temp)}°C
                    </AppText>
                  </View>

                  <Image
                    source={{ uri: getWeatherIconUrl(weatherIcon) }}
                    style={styles.weatherIcon}
                    resizeMode="contain"
                  />
                </View>

                <View
                  style={[
                    styles.feelsLikeBand,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <AppText variant="labelLarge" tone="secondary">
                    Feels like
                  </AppText>
                  <AppText variant="titleLarge" weight="bold">
                    {Math.round(weather.main.feels_like)}°C
                  </AppText>
                </View>
              </View>
            </AppCard>

            <View style={styles.metricGrid}>
              <View
                style={[
                  styles.metricTile,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <IconButton
                  icon="water-percent"
                  iconColor={theme.colors.tertiary}
                  size={26}
                  style={styles.metricIcon}
                />
                <AppText variant="titleMedium" weight="bold">
                  {weather.main.humidity}%
                </AppText>
                <AppText variant="labelMedium" tone="muted">
                  Humidity
                </AppText>
              </View>

              <View
                style={[
                  styles.metricTile,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <IconButton
                  icon="weather-windy"
                  iconColor={theme.colors.tertiary}
                  size={26}
                  style={styles.metricIcon}
                />
                <AppText variant="titleMedium" weight="bold">
                  {weather.wind.speed} m/s
                </AppText>
                <AppText variant="labelMedium" tone="muted">
                  Wind
                </AppText>
              </View>

              <View
                style={[
                  styles.metricTile,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <IconButton
                  icon="gauge"
                  iconColor={theme.colors.tertiary}
                  size={26}
                  style={styles.metricIcon}
                />
                <AppText variant="titleMedium" weight="bold">
                  {weather.main.pressure}
                </AppText>
                <AppText variant="labelMedium" tone="muted">
                  Pressure
                </AppText>
              </View>

              <View
                style={[
                  styles.metricTile,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <IconButton
                  icon="eye-outline"
                  iconColor={theme.colors.tertiary}
                  size={26}
                  style={styles.metricIcon}
                />
                <AppText variant="titleMedium" weight="bold">
                  {formatVisibility(weather.visibility)}
                </AppText>
                <AppText variant="labelMedium" tone="muted">
                  Visibility
                </AppText>
              </View>
            </View>

            <AppDivider style={styles.divider} />

            <View style={styles.rangeRow}>
              <View>
                <AppText variant="labelLarge" tone="muted">
                  Low
                </AppText>
                <AppText variant="titleLarge" weight="bold">
                  {Math.round(weather.main.temp_min)}°C
                </AppText>
              </View>
              <View style={styles.rangeDivider} />
              <View>
                <AppText variant="labelLarge" tone="muted">
                  High
                </AppText>
                <AppText variant="titleLarge" weight="bold">
                  {Math.round(weather.main.temp_max)}°C
                </AppText>
              </View>
            </View>
          </>
        ) : null}

        {!loading && !error && !weather ? (
          <View
            style={[
              styles.emptyPanel,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.custom.semantic.border.subtle,
              },
            ]}
          >
            <Image
              source={{ uri: getWeatherIconUrl() }}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <AppText variant="titleLarge" weight="bold">
              Start with a city
            </AppText>
            <AppText
              variant="bodyMedium"
              tone="secondary"
              style={styles.emptyText}
            >
              Search a city or choose one of the quick options above.
            </AppText>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    marginTop: 24,
    marginBottom: 12,
  },
  searchPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  searchInput: {
    marginBottom: 12,
  },
  quickCityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 16,
  },
  resultCard: {
    marginTop: 8,
  },
  resultCardContent: {
    padding: 20,
  },
  weatherSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryText: {
    flex: 1,
  },
  description: {
    marginTop: 4,
    opacity: 0.85,
    textTransform: 'capitalize',
  },
  temperature: {
    marginTop: 12,
  },
  weatherIcon: {
    width: 116,
    height: 116,
  },
  feelsLikeBand: {
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  metricTile: {
    borderRadius: 8,
    padding: 14,
    width: '48%',
    minHeight: 132,
    justifyContent: 'center',
  },
  metricIcon: {
    margin: 0,
    marginBottom: 6,
  },
  divider: {
    marginVertical: 20,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 8,
  },
  rangeDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#D0D5DD',
  },
  emptyPanel: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 24,
  },
  emptyIcon: {
    width: 112,
    height: 112,
    marginBottom: 8,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
