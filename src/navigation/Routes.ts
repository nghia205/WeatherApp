import LoginScreen from '../screens/LoginScreen';
import HomeTabs from '../tabs/HomeTabs';

const Routes = [
  { name: 'Home', component: HomeTabs, auth: true },
  { name: 'Login', component: LoginScreen, auth: false },
];

export default Routes;
