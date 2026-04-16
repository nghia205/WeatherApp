import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, List } from 'react-native-paper';

import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppText } from '../components/ui/AppText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ScreenEmpty } from '../components/feedback/ScreenEmpty';
import { ScreenError } from '../components/feedback/ScreenError';
import { ScreenLoading } from '../components/feedback/ScreenLoading';

const UserInfoScreen = () => {
  const { profile, isLoading, error, fetchProfile } = useUserStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
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
          <ScreenLoading message="Đang tải người dùng..." />
        ) : error ? (
          <ScreenError message={error} />
        ) : profile ? (
          <>
            <View style={styles.header}>
              <UserAvatar
                name={fullName || 'Người dùng'}
                uri={avatarUrl}
                size={120}
                outlined
              />

              <AppText
                variant="headlineMedium"
                weight="bold"
                style={styles.name}
              >
                {fullName || 'Người dùng'}
              </AppText>

              <AppText
                variant="bodyLarge"
                tone="secondary"
                style={styles.email}
              >
                {profile.email}
              </AppText>
            </View>

            <Card style={styles.infoCard} mode="elevated" elevation={2}>
              <Card.Content style={styles.cardContent}>
                <List.Section>
                  <List.Subheader>Thông tin cá nhân</List.Subheader>

                  <List.Item
                    title="Họ và tên"
                    description={fullName || 'Chưa cập nhật'}
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

            <AppButton
              variant="dangerTonal"
              onPress={logout}
              style={styles.logoutButton}
              contentStyle={styles.logoutButtonContent}
              icon="logout"
            >
              Đăng xuất
            </AppButton>
          </>
        ) : (
          <ScreenEmpty message="Không có dữ liệu" />
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
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  name: {
    marginTop: 16,
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
    marginHorizontal: 16,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default UserInfoScreen;
