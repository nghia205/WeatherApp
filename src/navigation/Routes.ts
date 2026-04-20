import LoginScreen from '../screens/LoginScreen';
import HomeTabs from '../tabs/HomeTabs';
import CreateJobScreen from '../screens/CreateJobScreen';
import CreatePersonScreen from '../screens/CreatePersonScreen';

const Routes = [
  { name: 'Home', component: HomeTabs, auth: true },
  { name: 'CreateJob', component: CreateJobScreen, auth: true },
  { name: 'CreatePerson', component: CreatePersonScreen, auth: true },
  { name: 'Login', component: LoginScreen, auth: false },
];

export default Routes;
