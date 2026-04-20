import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Divider, IconButton, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

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
const LIST_FOOTER_HEIGHT = 96;
const DIRECTUS_ASSET_URL = 'https://silvatek.vn:8080/assets';

const keyExtractor = (item: Person, index: number) =>
  item.id?.toString() || index.toString();

const PeopleEmpty = () => <ScreenEmpty message="No people found" />;

type JobMenuItemProps = {
  job: Job;
  onSelect: (job: Job) => void;
};

const JobMenuItem = ({ job, onSelect }: JobMenuItemProps) => {
  return (
    <Menu.Item
      onPress={() => onSelect(job)}
      title={job.title || job.name || `Job ${job.id}`}
    />
  );
};

type PersonCardProps = {
  item: Person;
  token: string | null;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
};

const PersonCard = memo(
  ({
    item,
    token,
    primary,
    primaryContainer,
    onPrimaryContainer,
    surfaceVariant,
    onSurfaceVariant,
  }: PersonCardProps) => {
    const name = item.name || item.full_name || 'Unnamed person';
    const firstChar = name.charAt(0).toUpperCase();
    const jobImageSource = useMemo(
      () =>
        item.job?.image && token
          ? {
              uri: `${DIRECTUS_ASSET_URL}/${item.job.image}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined,
      [item.job?.image, token],
    );

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
                { backgroundColor: primaryContainer },
              ]}
            >
              <AppText weight="bold" style={{ color: onPrimaryContainer }}>
                {firstChar}
              </AppText>
            </View>
          </View>

          <AppDivider style={styles.divider} />

          {item.job ? (
            <View
              style={[styles.jobContainer, { backgroundColor: surfaceVariant }]}
            >
              <View style={styles.jobRow}>
                <IconButton
                  icon="briefcase-outline"
                  size={20}
                  iconColor={primary}
                  style={styles.jobIcon}
                />
                <View style={styles.jobContent}>
                  <AppText
                    variant="labelLarge"
                    weight="bold"
                    style={{ color: onSurfaceVariant }}
                  >
                    {item.job.title || item.job.name || 'No job title'}
                  </AppText>
                  {item.job.description ? (
                    <AppText
                      variant="bodySmall"
                      style={[
                        styles.jobDescription,
                        { color: onSurfaceVariant },
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
  },
);

const DataScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const token = useAuthStore(state => state.token);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    people,
    jobs,
    isLoadingPeople,
    isLoadingJobs,
    isFetchingMore,
    totalCount,
    peopleError,
    jobsError,
    loadMoreError,
    searchName,
    setSearchName,
    setSelectedJobId,
    fetchJobs,
    fetchPeople,
    fetchMorePeople,
  } = useDataStore(
    useShallow(state => ({
      people: state.people,
      jobs: state.jobs,
      isLoadingPeople: state.isLoadingPeople,
      isLoadingJobs: state.isLoadingJobs,
      isFetchingMore: state.isFetchingMore,
      totalCount: state.totalCount,
      peopleError: state.peopleError,
      jobsError: state.jobsError,
      loadMoreError: state.loadMoreError,
      searchName: state.searchName,
      setSearchName: state.setSearchName,
      setSelectedJobId: state.setSelectedJobId,
      fetchJobs: state.fetchJobs,
      fetchPeople: state.fetchPeople,
      fetchMorePeople: state.fetchMorePeople,
    })),
  );

  const [localSearch, setLocalSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [selectedJobText, setSelectedJobText] = useState('All jobs');
  const [headerHeight, setHeaderHeight] = useState(HEADER_FALLBACK_HEIGHT);

  const clampedScrollY = useMemo(
    () => Animated.diffClamp(scrollY, 0, headerHeight),
    [headerHeight, scrollY],
  );

  const headerTranslateY = useMemo(
    () =>
      clampedScrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight],
        extrapolate: 'clamp',
      }),
    [clampedScrollY, headerHeight],
  );

  const hasMorePeople = people.length < totalCount;

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

  const handleJobSelect = useCallback((job?: Job) => {
    if (job) {
      setSelectedJobId(String(job.id));
      setSelectedJobText(job.title || job.name || 'Selected job');
    } else {
      setSelectedJobId(undefined);
      setSelectedJobText('All jobs');
    }

    setMenuVisible(false);
  }, [setSelectedJobId]);

  const handleEndReached = useCallback(() => {
    if (!hasMorePeople || isFetchingMore || loadMoreError) return;

    fetchMorePeople();
  }, [fetchMorePeople, hasMorePeople, isFetchingMore, loadMoreError]);

  const handleAnimatedHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeaderHeight = event.nativeEvent.layout.height;

    if (Math.abs(nextHeaderHeight - headerHeight) > 1) {
      setHeaderHeight(nextHeaderHeight);
    }
  }, [headerHeight]);

  const handleSelectAllJobs = useCallback(() => {
    handleJobSelect(undefined);
  }, [handleJobSelect]);

  const handleOpenCreateMenu = useCallback(() => {
    setCreateMenuVisible(true);
  }, []);

  const handleCloseCreateMenu = useCallback(() => {
    setCreateMenuVisible(false);
  }, []);

  const handleNavigateCreateJob = useCallback(() => {
    setCreateMenuVisible(false);
    navigation.navigate('CreateJob');
  }, [navigation]);

  const handleNavigateCreatePerson = useCallback(() => {
    setCreateMenuVisible(false);
    navigation.navigate('CreatePerson');
  }, [navigation]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );

  const renderPerson = useCallback(
    ({ item }: { item: Person }) => {
      return (
        <PersonCard
          item={item}
          token={token}
          primary={theme.colors.primary}
          primaryContainer={theme.colors.primaryContainer}
          onPrimaryContainer={theme.colors.onPrimaryContainer}
          surfaceVariant={theme.colors.surfaceVariant}
          onSurfaceVariant={theme.colors.onSurfaceVariant}
        />
      );
    },
    [
      theme.colors.onPrimaryContainer,
      theme.colors.onSurfaceVariant,
      theme.colors.primary,
      theme.colors.primaryContainer,
      theme.colors.surfaceVariant,
      token,
    ],
  );

  const renderFooter = useCallback(() => {
    if (people.length === 0) return null;

    return (
      <View style={styles.listFooter}>
        {isFetchingMore ? (
          <ScreenLoading message="Loading more people..." />
        ) : loadMoreError ? (
          <ScreenError
            message={loadMoreError}
            actionLabel="Retry load more"
            onRetry={fetchMorePeople}
          />
        ) : null}
      </View>
    );
  }, [fetchMorePeople, isFetchingMore, loadMoreError, people.length]);

  return (
    <ScreenContainer paddingHorizontal={0}>
      <View style={styles.content}>
        {isLoadingPeople && people.length === 0 ? (
          <View
            style={[styles.initialState, { paddingTop: headerHeight + 24 }]}
          >
            <ScreenLoading message="Loading people..." />
          </View>
        ) : peopleError && people.length === 0 ? (
          <View
            style={[styles.initialState, { paddingTop: headerHeight + 24 }]}
          >
            <ScreenError
              message={peopleError}
              actionLabel="Retry"
              onRetry={fetchPeople}
            />
          </View>
        ) : (
          <Animated.FlatList
            data={people}
            keyExtractor={keyExtractor}
            renderItem={renderPerson}
            contentContainerStyle={[
              styles.listContainer,
              { paddingTop: headerHeight + 8 },
            ]}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            refreshing={isLoadingPeople && people.length > 0}
            onRefresh={fetchPeople}
            onScroll={onScroll}
            scrollEventThrottle={16}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={PeopleEmpty}
            initialNumToRender={8}
            maxToRenderPerBatch={6}
            updateCellsBatchingPeriod={40}
            windowSize={7}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          />
        )}
      </View>

      <View
        style={[styles.headerClip, { height: headerHeight }]}
        pointerEvents="box-none"
      >
        <Animated.View
          onLayout={handleAnimatedHeaderLayout}
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
                <Menu
                  visible={createMenuVisible}
                  onDismiss={handleCloseCreateMenu}
                  anchor={
                    <AppButton
                      variant="primary"
                      icon="plus"
                      onPress={handleOpenCreateMenu}
                      fullWidth={false}
                    >
                      Add
                    </AppButton>
                  }
                >
                  <Menu.Item
                    onPress={handleNavigateCreatePerson}
                    title="Create person"
                  />
                  <Menu.Item
                    onPress={handleNavigateCreateJob}
                    title="Create job"
                  />
                </Menu>
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
              <Menu.Item onPress={handleSelectAllJobs} title="All jobs" />
              <Divider />
              {jobs.map(job => (
                <JobMenuItem
                  key={job.id}
                  job={job}
                  onSelect={handleJobSelect}
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
  listFooter: {
    minHeight: LIST_FOOTER_HEIGHT,
    justifyContent: 'center',
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
});

export default DataScreen;
