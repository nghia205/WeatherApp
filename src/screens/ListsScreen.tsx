import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';

const ListsScreen = () => {
  const theme = useTheme();

  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
};

export default ListsScreen;
