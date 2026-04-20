import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, User, Database } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import DataScreen from '../screens/DataScreen';

const Tab = createBottomTabNavigator();
const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <House color={color} size={size} />
);
const renderDataIcon = ({ color, size }: { color: string; size: number }) => (
  <Database color={color} size={size} />
);
const renderProfileIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <User color={color} size={size} />;

const HOME_OPTIONS = {
  title: 'Home',
  tabBarIcon: renderHomeIcon,
};
const DATA_OPTIONS = {
  title: 'Data',
  tabBarIcon: renderDataIcon,
};
const PROFILE_OPTIONS = {
  title: 'Profile',
  tabBarIcon: renderProfileIcon,
};

function HomeTabs() {
  const theme = useTheme();
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.elevation.level2,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    }),
    [
      theme.colors.elevation.level2,
      theme.colors.onSurfaceVariant,
      theme.colors.primary,
    ],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="TabHome">
      <Tab.Screen
        name="TabHome"
        component={HomeScreen}
        options={HOME_OPTIONS}
      />
      <Tab.Screen
        name="TabData"
        component={DataScreen}
        options={DATA_OPTIONS}
      />
      <Tab.Screen
        name="TabProfile"
        component={UserInfoScreen}
        options={PROFILE_OPTIONS}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
