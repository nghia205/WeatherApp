import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface, useTheme } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer = ({
  children,
  paddingHorizontal = 16,
  style,
}: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Surface
        style={[
          {
            flex: 1,
            paddingHorizontal: paddingHorizontal,
            backgroundColor: theme.colors.background,
          },
          style,
        ]}
      >
        {children}
      </Surface>
    </SafeAreaView>
  );
};
