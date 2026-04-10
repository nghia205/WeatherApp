import { ActivityIndicator, View } from 'react-native';

const ProtectedScreen = (Component: any) => (props: any) => {
  const user = false;

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    props.navigation.replace('Login');
    return null;
  }

  return <Component {...props} />;
};
export default ProtectedScreen;
