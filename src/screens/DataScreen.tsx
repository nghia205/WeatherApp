import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Card,
  Divider,
  IconButton,
  Menu,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';

import { useDataStore, Job, Person } from '../store/useDataStore';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { AppTextInput } from '../components/ui/AppTextInput';
import { AppDivider } from '../components/ui/AppDivider';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ScreenEmpty } from '../components/feedback/ScreenEmpty';
import { ScreenError } from '../components/feedback/ScreenError';
import { ScreenLoading } from '../components/feedback/ScreenLoading';
import { useAppTheme } from '../theme/useAppTheme';
import { useAuthStore } from '../store/useAuthStore';

const HEADER_FALLBACK_HEIGHT = 174;
const DIRECTUS_ASSET_URL = 'https://silvatek.vn:8080/assets';

const DataScreen = () => {
  const theme = useAppTheme();
  const token = useAuthStore(state => state.token);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    people,
    jobs,
    isLoadingPeople,
    isLoadingJobs,
    isFetchingMore,
    peopleError,
    jobsError,
    loadMoreError,
    setSearchName,
    setSelectedJobId,
    fetchJobs,
    fetchPeople,
    fetchMorePeople,
    searchName,
  } = useDataStore();

  const [localSearch, setLocalSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedJobText, setSelectedJobText] = useState('All jobs');
  const [headerHeight, setHeaderHeight] = useState(HEADER_FALLBACK_HEIGHT);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  const clampedScrollY = useMemo(
    () => Animated.diffClamp(scrollY, 0, headerHeight),
    [headerHeight, scrollY],
  );

  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchJobs();
    fetchPeople();
  }, [fetchJobs, fetchPeople]);

  useEffect(() => {
    if (localSearch === searchName) return;

    const handler = setTimeout(() => {
      setSearchName(localSearch);
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, searchName, setSearchName]);

  const handleJobSelect = (job?: Job) => {
    if (job) {
      setSelectedJobId(String(job.id));
      setSelectedJobText(job.title || job.name || 'Selected job');
    } else {
      setSelectedJobId(undefined);
      setSelectedJobText('All jobs');
    }

    setMenuVisible(false);
  };

  const handleEndReached = () => {
    if (!loadMoreError) {
      fetchMorePeople();
    }
  };

  const handleHeaderLayout = (height: number) => {
    if (Math.abs(height - headerHeight) > 1) {
      setHeaderHeight(height);
    }
  };

  const renderPerson = ({ item }: { item: Person }) => {
    const name = item.name || item.full_name || 'Unnamed person';
    const firstChar = name.charAt(0).toUpperCase();
    const jobImageSource =
      item.job?.image && token
        ? {
            uri: `${DIRECTUS_ASSET_URL}/${item.job.image}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;

    return (
      <AppCard variant="elevated" style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <View style={styles.personInfo}>
              <AppText
                variant="titleLarge"
                weight="bold"
                style={styles.personName}
              >
                {name}
              </AppText>
              <AppText variant="bodyMedium" tone="secondary">
                Age: {item.age || 'Not provided'}
              </AppText>
            </View>

            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <AppText
                weight="bold"
                style={{ color: theme.colors.onPrimaryContainer }}
              >
                {firstChar}
              </AppText>
            </View>
          </View>

          <AppDivider style={styles.divider} />

          {item.job ? (
            <View
              style={[
                styles.jobContainer,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <View style={styles.jobRow}>
                <IconButton
                  icon="briefcase-outline"
                  size={20}
                  iconColor={theme.colors.primary}
                  style={styles.jobIcon}
                />
                <View style={styles.jobContent}>
                  <AppText
                    variant="labelLarge"
                    weight="bold"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {item.job.title || item.job.name || 'No job title'}
                  </AppText>
                  {item.job.description ? (
                    <AppText
                      variant="bodySmall"
                      style={[
                        styles.jobDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {item.job.description}
                    </AppText>
                  ) : null}
                </View>
              </View>

              {jobImageSource ? (
                <Image
                  source={jobImageSource}
                  style={styles.jobImage}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          ) : null}
        </Card.Content>
      </AppCard>
    );
  };

  const renderFooter = () => {
    if (isFetchingMore) {
      return <ScreenLoading message="Loading more people..." />;
    }

    if (loadMoreError) {
      return (
        <ScreenError
          message={loadMoreError}
          actionLabel="Retry load more"
          onRetry={fetchMorePeople}
        />
      );
    }

    return null;
  };

  const renderHeader = () => (
    <View
      style={[
        styles.headerClip,
        {
          height: headerHeight,
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        onLayout={event => handleHeaderLayout(event.nativeEvent.layout.height)}
        style={[
          styles.animatedHeader,
          {
            backgroundColor: theme.colors.background,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.header}>
          <SectionHeader
            title="Community"
            style={styles.sectionHeader}
            action={
              <AppButton
                variant="primary"
                icon="plus"
                onPress={() => setModalVisible(true)}
                fullWidth={false}
              >
                Add
              </AppButton>
            }
          />
        </View>

        <View style={styles.filterContainer}>
          <AppTextInput
            variant="search"
            placeholder="Search by name..."
            value={localSearch}
            onChangeText={setLocalSearch}
            style={styles.searchInput}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <AppButton
                variant="secondary"
                onPress={() => setMenuVisible(true)}
                fullWidth={false}
                icon="chevron-down"
                loading={isLoadingJobs}
              >
                {selectedJobText}
              </AppButton>
            }
          >
            <Menu.Item
              onPress={() => handleJobSelect(undefined)}
              title="All jobs"
            />
            <Divider />
            {jobs.map(job => (
              <Menu.Item
                key={job.id}
                onPress={() => handleJobSelect(job)}
                title={job.title || job.name || `Job ${job.id}`}
              />
            ))}
          </Menu>

          {jobsError ? (
            <View style={styles.jobsError}>
              <ScreenError
                message={jobsError}
                actionLabel="Retry jobs"
                onRetry={fetchJobs}
              />
            </View>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );

  const renderContent = () => {
    if (isLoadingPeople && people.length === 0) {
      return (
        <View
          style={[styles.initialState, { paddingTop: headerHeight + 24 }]}
        >
          <ScreenLoading message="Loading people..." />
        </View>
      );
    }

    if (peopleError && people.length === 0) {
      return (
        <View
          style={[styles.initialState, { paddingTop: headerHeight + 24 }]}
        >
          <ScreenError
            message={peopleError}
            actionLabel="Retry"
            onRetry={fetchPeople}
          />
        </View>
      );
    }

    return (
      <Animated.FlatList
        data={people}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderPerson}
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: headerHeight + 8 },
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isLoadingPeople && people.length > 0}
        onRefresh={fetchPeople}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<ScreenEmpty message="No people found" />}
      />
    );
  };

  return (
    <ScreenContainer paddingHorizontal={0}>
      <View style={styles.content}>{renderContent()}</View>
      {renderHeader()}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalCard,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.custom.metrics.radius.xl,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <AppText variant="headlineSmall" weight="bold">
              Add a new profile
            </AppText>

            <AppText
              variant="bodyMedium"
              tone="muted"
              style={styles.modalDescription}
            >
              Enter the profile details below.
            </AppText>

            <AppTextInput
              label="Name"
              value={newName}
              onChangeText={setNewName}
            />

            <AppTextInput
              label="Age"
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="numeric"
            />

            <AppTextInput
              label="Job (preview only)"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />

            <View style={styles.modalActions}>
              <AppButton
                variant="ghost"
                onPress={() => setModalVisible(false)}
                fullWidth={false}
              >
                Cancel
              </AppButton>

              <AppButton
                variant="primary"
                onPress={() => {
                  Alert.alert('Profile creation is only a UI preview.');
                  setModalVisible(false);
                }}
                fullWidth={false}
              >
                Save profile
              </AppButton>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  headerClip: {
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  animatedHeader: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    marginBottom: 12,
  },
  jobsError: {
    marginTop: 12,
  },
  initialState: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    marginBottom: 2,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  jobContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobIcon: {
    margin: 0,
    marginRight: 8,
  },
  jobContent: {
    flex: 1,
  },
  jobDescription: {
    opacity: 0.8,
    marginTop: 2,
  },
  jobImage: {
    width: '100%',
    height: 160,
    marginTop: 12,
    borderRadius: 12,
  },
  modalCard: {
    padding: 24,
    margin: 20,
    maxHeight: '80%',
  },
  modalDescription: {
    marginBottom: 20,
    marginTop: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
});

export default DataScreen;
