/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { StatusBar, useColorScheme } from 'react-native';
import { useThemeStore } from './src/store/useThemeStore';
import Toast from 'react-native-toast-message';

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4361EE', // Elegant Blue
    secondary: '#3A0CA3', // Deep Indigo
    tertiary: '#7209B7', // Purple
    background: '#F8F9FA', // Soft light gray background
    surface: '#FFFFFF', // Pure white cards
    surfaceVariant: '#E9ECEF', // Subtle gray for input backgrounds
    error: '#EF233C',
  },
};

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CC9F0', // Vivid cyan
    secondary: '#4361EE', // Vibrant blue
    tertiary: '#F72585', // Neon pink
    background: '#0F172A', // Very dark blue-slate
    surface: '#1E293B', // Lighter slate for cards
    surfaceVariant: '#334155', // Inputs on dark mode
    error: '#F07167',
  },
};

function App() {
  const systemTheme = useColorScheme();
  const themeMode = useThemeStore(state => state.themeMode);
  const isDarkMode =
    themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </PaperProvider>

      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
