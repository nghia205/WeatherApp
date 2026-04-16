import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  name?: string;
  uri?: string | null;
  size?: number;
  outlined?: boolean;
};

export const UserAvatar = ({
  name,
  uri,
  size = 120,
  outlined = false,
}: Props) => {
  const theme = useAppTheme();
  const label = (name?.trim()?.[0] || 'U').toUpperCase();

  if (!outlined) {
    return uri ? (
      <Avatar.Image size={size} source={{ uri }} />
    ) : (
      <Avatar.Text
        size={size}
        label={label}
        style={{ backgroundColor: theme.colors.primary }}
      />
    );
  }

  return (
    <View
      style={[
        styles.outline,
        {
          borderColor: theme.custom.semantic.border.accent,
          borderRadius: size,
        },
      ]}
    >
      {uri ? (
        <Avatar.Image size={size} source={{ uri }} />
      ) : (
        <Avatar.Text
          size={size}
          label={label}
          style={{ backgroundColor: theme.colors.primary }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outline: {
    padding: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
