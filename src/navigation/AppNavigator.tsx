import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Routes from './Routes';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { getValidToken } from '../utils/getValidToken';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, token, tokenExpires, isAppLoading, setAppReady, logout } =
    useAuthStore();
  const theme = useTheme();

  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const initApp = async () => {
      if (!token) {
        setAppReady();
        return;
      }
      const currentTime = Date.now();
      // Phần này nên gọi lên api/me để check token expires
      if (currentTime > tokenExpires) {
        try {
          await getValidToken();
        } catch (error) {}
      }

      setAppReady();
    };

    initApp();
  }, [token]);

  if (isAppLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Luồng cho người ĐÃ ĐĂNG NHẬP
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
            // Luồng cho người CHƯA ĐĂNG NHẬP
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
    </>
  );
};

export default AppNavigator;
