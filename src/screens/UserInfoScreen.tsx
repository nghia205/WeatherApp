import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Avatar,
  Text,
  Button,
  Card,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

const UserInfoScreen = () => {
  const { profile, isLoading, error, fetchProfile } = useUserStore();
  const { logout } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fullName = profile
    ? (profile.first_name || '') + ' ' + (profile.last_name || '')
    : '';
  const avatarUrl = profile?.avatar
    ? `https://silvatek.vn:8080/assets/${profile.avatar}`
    : null;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.loader}
            />
          ) : error ? (
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          ) : profile ? (
            <>
              {avatarUrl ? (
                <Avatar.Image
                  size={100}
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={100}
                  label={(profile.first_name?.[0] || 'U').toUpperCase()}
                  style={styles.avatar}
                />
              )}
              <Text variant="headlineMedium" style={styles.name}>
                {fullName.trim() || 'Người dùng'}
              </Text>
              <Text variant="titleMedium" style={styles.email}>
                {profile.email}
              </Text>
            </>
          ) : (
            <Text>Không có dữ liệu</Text>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={logout}
        style={styles.logoutButton}
        buttonColor={theme.colors.error}
      >
        Đăng xuất
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    opacity: 0.7,
  },
  loader: {
    marginVertical: 40,
  },
  logoutButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default UserInfoScreen;
