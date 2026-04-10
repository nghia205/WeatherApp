import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import Routes from './Routes';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, token, tokenExpires, isAppLoading, setAppReady, logout } =
    useAuthStore();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initApp = async () => {
      if (!token) {
        setAppReady();
        return;
      }
      const currentTime = Date.now();
      // Phần này nên gọi lên api/me để check token expires
      if (currentTime > tokenExpires) {
        logout();
      }
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
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
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
