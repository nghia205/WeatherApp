import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import DataScreen from '../screens/DataScreen';
import { House, User, Database } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
      initialRouteName="TabHome"
    >
      <Tab.Screen
        name="TabHome"
        component={HomeScreen}
        options={{
          title: 'Trang Chủ',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TabData"
        component={DataScreen}
        options={{
          title: 'Dữ liệu',
          tabBarIcon: ({ color, size }) => (
            <Database color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TabProfile"
        component={UserInfoScreen}
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
