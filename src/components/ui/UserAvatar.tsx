import React, { memo, useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = {
  name?: string;
  uri?: string | null;
  source?: ImageSourcePropType;
  size?: number;
  outlined?: boolean;
};

export const UserAvatar = memo(
  ({ name, uri, source, size = 120, outlined = false }: Props) => {
    const theme = useAppTheme();
    const label = useMemo(
      () => (name?.trim()?.[0] || 'U').toUpperCase(),
      [name],
    );
    const imageSource = useMemo(
      () => source || (uri ? { uri } : undefined),
      [source, uri],
    );
    const textAvatarStyle = useMemo(
      () => ({ backgroundColor: theme.colors.primary }),
      [theme.colors.primary],
    );
    const outlineStyle = useMemo(
      () => [
        styles.outline,
        {
          borderColor: theme.custom.semantic.border.accent,
          borderRadius: size,
        },
      ],
      [size, theme.custom.semantic.border.accent],
    );

    if (!outlined) {
      return imageSource ? (
        <Avatar.Image size={size} source={imageSource} />
      ) : (
        <Avatar.Text size={size} label={label} style={textAvatarStyle} />
      );
    }

    return (
      <View style={outlineStyle}>
        {imageSource ? (
          <Avatar.Image size={size} source={imageSource} />
        ) : (
          <Avatar.Text size={size} label={label} style={textAvatarStyle} />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  outline: {
    padding: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
