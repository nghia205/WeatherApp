import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListsScreen = () => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Surface
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'flex-start',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          variant="displayMedium"
          style={{
            textAlign: 'center',
            marginVertical: 20,
            fontWeight: 'bold',
          }}
        >
          List
        </Text>
      </Surface>
    </SafeAreaView>
  );
};

export default ListsScreen;
