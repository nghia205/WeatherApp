import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4facfe' }}>
      <View style={[styles.container]}>
        <Text style={styles.title}>List</Text>
      </View>
    </SafeAreaView>
  );
};

export default ListsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#4facfe',
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginVertical: 20,
  },

  searchBox: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },

  button: {
    marginLeft: 10,
    backgroundColor: '#222',
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    marginTop: 40,
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  temp: {
    fontSize: 60,
    fontWeight: '200',
    color: '#ff7a00',
  },

  desc: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    textTransform: 'capitalize',
  },

  extraInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },

  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});
