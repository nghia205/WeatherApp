module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-native-community|@react-native-async-storage|react-native-image-picker|react-native-paper|react-native-safe-area-context|react-native-screens|react-native-toast-message|@react-navigation)/)',
  ],
};
