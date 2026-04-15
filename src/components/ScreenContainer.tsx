import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Surface, useTheme } from 'react-native-paper';
import { StyleProp, ViewStyle, ImageBackground, StyleSheet, Platform } from 'react-native';

interface Props {
  children: React.ReactNode;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
}

const BG_IMAGE_URL = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&q=80'; // Beautiful abstract mesh gradient

export const ScreenContainer = ({
  children,
  paddingHorizontal = 16,
  style,
}: Props) => {
  const theme = useTheme();

  // Tạo một lớp overlay nhẹ để chữ dễ đọc hơn tuỳ theo hệ thống đang sáng hay tối
  const overlayColor = theme.dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.4)';

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      style={styles.backgroundImage}
      blurRadius={Platform.OS === 'ios' ? 10 : 5}
    >
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, backgroundColor: 'transparent' }}
      >
        <Surface
          style={[
            {
              flex: 1,
              paddingHorizontal: paddingHorizontal,
              backgroundColor: overlayColor,
            },
            style,
          ]}
        >
          {children}
        </Surface>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
