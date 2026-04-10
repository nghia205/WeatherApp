import ListsScreen from '../screens/ListsScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeTabs from '../tabs/HomeTabs';

const Routes = [
  { name: 'Home', component: HomeTabs, auth: true },
  { name: 'List', component: ListsScreen, auth: true },
  { name: 'Login', component: LoginScreen, auth: false },
];

export default Routes;
