import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigation/AppNavigator';
import { DarkTheme, LightTheme } from './src/theme';
import { useThemeStore } from './src/store/useThemeStore';

function App() {
  const systemTheme = useColorScheme();
  const themeMode = useThemeStore(state => state.themeMode);

  const isDarkMode =
    themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const theme = isDarkMode ? DarkTheme : LightTheme;
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          translucent={false}
          backgroundColor={theme.colors.background}
          barStyle={statusBarStyle}
        />
        <AppNavigator />
      </PaperProvider>
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
