import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, List } from 'react-native-paper';
import { useShallow } from 'zustand/react/shallow';

import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppText } from '../components/ui/AppText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ScreenEmpty } from '../components/feedback/ScreenEmpty';
import { ScreenError } from '../components/feedback/ScreenError';
import { ScreenLoading } from '../components/feedback/ScreenLoading';

type ListIconProps = Parameters<
  NonNullable<React.ComponentProps<typeof List.Item>['left']>
>[0];

const renderAccountIcon = (props: ListIconProps) => (
  <List.Icon {...props} icon="account-outline" />
);

const renderEmailIcon = (props: ListIconProps) => (
  <List.Icon {...props} icon="email-outline" />
);

const UserInfoScreen = () => {
  const { profile, isLoading, error, fetchProfile } = useUserStore(
    useShallow(state => ({
      profile: state.profile,
      isLoading: state.isLoading,
      error: state.error,
      fetchProfile: state.fetchProfile,
    })),
  );
  const { logout, token } = useAuthStore(
    useShallow(state => ({
      logout: state.logout,
      token: state.token,
    })),
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : '';
  const avatarUrl = profile?.avatar
    ? `https://silvatek.vn:8080/assets/${profile.avatar}`
    : null;
  const avatarSource = useMemo(
    () =>
      avatarUrl && token
        ? {
            uri: avatarUrl,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined,
    [avatarUrl, token],
  );

  return (
    <ScreenContainer paddingHorizontal={0} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <ScreenLoading message="Loading user..." />
        ) : error ? (
          <ScreenError message={error} onRetry={fetchProfile} />
        ) : profile ? (
          <>
            <View style={styles.header}>
              <UserAvatar
                name={fullName || 'User'}
                source={avatarSource}
                size={120}
                outlined
              />

              <AppText
                variant="headlineMedium"
                weight="bold"
                style={styles.name}
              >
                {fullName || 'User'}
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
                  <List.Subheader>Personal information</List.Subheader>

                  <List.Item
                    title="Full name"
                    description={fullName || 'Not updated'}
                    left={renderAccountIcon}
                  />

                  <Divider />

                  <List.Item
                    title="Email"
                    description={profile.email}
                    left={renderEmailIcon}
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
              Sign out
            </AppButton>
          </>
        ) : (
          <ScreenEmpty message="No profile data" />
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
