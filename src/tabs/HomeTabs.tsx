import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ListsScreen from '../screens/ListsScreen';
import { House, List } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
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
        name="TabListsScreen"
        component={ListsScreen}
        options={{
          title: 'Danh Sách',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
