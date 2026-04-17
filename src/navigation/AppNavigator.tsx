import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import Routes from './Routes';
import { useAuthStore } from '../store/useAuthStore';
import { getValidToken } from '../utils/getValidToken';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, token, tokenExpires, isAppLoading, setAppReady } =
    useAuthStore();
  const theme = useTheme();

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const initApp = async () => {
      if (!token) {
        setAppReady();
        return;
      }

      // Refresh an expired persisted token before unlocking protected routes.
      if (Date.now() > tokenExpires) {
        try {
          await getValidToken();
        } catch {}
      }

      setAppReady();
    };

    initApp();
  }, [setAppReady, token, tokenExpires]);

  if (isAppLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Group>
            {Routes.filter(item => item.auth).map(item => (
              <Stack.Screen
                key={item.name}
                name={item.name}
                component={item.component}
              />
            ))}
          </Stack.Group>
        ) : (
          <Stack.Group>
            {Routes.filter(item => !item.auth).map(item => (
              <Stack.Screen
                key={item.name}
                name={item.name}
                component={item.component}
              />
            ))}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
