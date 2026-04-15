import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  Text,
  Button,
  Card,
  ActivityIndicator,
  useTheme,
  List,
  Divider,
} from 'react-native-paper';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { ScreenContainer } from '../components/ScreenContainer';

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
    <ScreenContainer paddingHorizontal={0} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={theme.colors.primary}
            />
            <Text style={{ marginTop: 12, color: theme.colors.secondary }}>
              Đang tải người dùng...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={{ color: theme.colors.error, fontSize: 16 }}>
              {error}
            </Text>
          </View>
        ) : profile ? (
          <>
            <View style={styles.header}>
              <View
                style={[
                  styles.avatarContainer,
                  { borderColor: theme.colors.primary },
                ]}
              >
                {avatarUrl ? (
                  <Avatar.Image size={120} source={{ uri: avatarUrl }} />
                ) : (
                  <Avatar.Text
                    size={120}
                    label={(profile.first_name?.[0] || 'U').toUpperCase()}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
              </View>
              <Text variant="headlineMedium" style={styles.name}>
                {fullName.trim() || 'Người dùng'}
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.email, { color: theme.colors.secondary }]}
              >
                {profile.email}
              </Text>
            </View>

            <Card style={styles.infoCard} mode="elevated" elevation={2}>
              <Card.Content style={styles.cardContent}>
                <List.Section>
                  <List.Subheader>Thông tin cá nhân</List.Subheader>
                  <List.Item
                    title="Họ và tên"
                    description={fullName.trim() || 'Chưa cập nhật'}
                    left={props => (
                      <List.Icon {...props} icon="account-outline" />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Email"
                    description={profile.email}
                    left={props => (
                      <List.Icon {...props} icon="email-outline" />
                    )}
                  />
                </List.Section>
              </Card.Content>
            </Card>

            <Button
              mode="contained-tonal"
              onPress={logout}
              style={styles.logoutButton}
              contentStyle={styles.logoutButtonContent}
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.onErrorContainer}
              icon="logout"
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <View style={styles.centerContent}>
            <Text>Không có dữ liệu</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  avatarContainer: {
    padding: 4,
    borderWidth: 2,
    borderRadius: 100,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    opacity: 0.8,
  },
  infoCard: {
    borderRadius: 20,
    marginBottom: 32,
  },
  cardContent: {
    padding: 0,
    paddingVertical: 8,
  },
  logoutButton: {
    borderRadius: 12,
    marginHorizontal: 16,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default UserInfoScreen;
