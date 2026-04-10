import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import ProtectedScreen from '../components/ProtectedScreen';
import Routes from './Routes';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          {Routes.map((item: any) => {
            const Component = item.auth
              ? ProtectedScreen(item.component)
              : item.component;

            return <Stack.Screen name={item.name} component={Component} />;
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
