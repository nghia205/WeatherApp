import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect, useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { useShallow } from 'zustand/react/shallow';
import Routes from './Routes';
import { useAuthStore } from '../store/useAuthStore';
import { getValidToken } from '../utils/getValidToken';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();
const STACK_SCREEN_OPTIONS = { headerShown: false };
const PROTECTED_ROUTES = Routes.filter(item => item.auth);
const PUBLIC_ROUTES = Routes.filter(item => !item.auth);

const AppNavigator = () => {
  const { user, token, tokenExpires, isAppLoading, setAppReady } = useAuthStore(
    useShallow(state => ({
      user: state.user,
      token: state.token,
      tokenExpires: state.tokenExpires,
      isAppLoading: state.isAppLoading,
      setAppReady: state.setAppReady,
    })),
  );
  const theme = useTheme();

  const navigationTheme = useMemo(
    () => (theme.dark ? DarkTheme : DefaultTheme),
    [theme.dark],
  );

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
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <Stack.Navigator screenOptions={STACK_SCREEN_OPTIONS}>
        {user ? (
          <Stack.Group>
            {PROTECTED_ROUTES.map(item => (
              <Stack.Screen
                key={item.name}
                name={item.name}
                component={item.component}
              />
            ))}
          </Stack.Group>
        ) : (
          <Stack.Group>
            {PUBLIC_ROUTES.map(item => (
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
