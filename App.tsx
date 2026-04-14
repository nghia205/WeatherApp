/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useThemeStore } from './src/store/useThemeStore';
import Toast from 'react-native-toast-message';

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E88E5',
    secondary: '#03A9F4',
  },
};
const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#81D4FA',
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
        <AppNavigator />
      </PaperProvider>

      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
