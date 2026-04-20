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
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Card,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Modal,
  Portal,
} from 'react-native-paper';
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
import { showErrorToast, showSuccessToast } from '../utils/showToast';
import { isForbiddenError } from '../utils/apiError';

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

type DeleteTarget =
  | {
      type: 'person';
      item: Person;
    }
  | {
      type: 'job';
      item: Job;
    };

type PersonCardProps = {
  item: Person;
  token: string | null;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (person: Person) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
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
    onEditPerson,
    onDeletePerson,
    onEditJob,
    onDeleteJob,
  }: PersonCardProps) => {
    const [personMenuVisible, setPersonMenuVisible] = useState(false);
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
    const handleOpenMenu = useCallback(() => {
      setPersonMenuVisible(true);
    }, []);
    const handleCloseMenu = useCallback(() => {
      setPersonMenuVisible(false);
    }, []);
    const handleEditPerson = useCallback(() => {
      setPersonMenuVisible(false);
      onEditPerson(item);
    }, [item, onEditPerson]);
    const handleDeletePerson = useCallback(() => {
      setPersonMenuVisible(false);
      onDeletePerson(item);
    }, [item, onDeletePerson]);
    const handleEditJob = useCallback(() => {
      if (!item.job) return;
      onEditJob(item.job);
    }, [item.job, onEditJob]);
    const handleDeleteJob = useCallback(() => {
      if (!item.job) return;
      onDeleteJob(item.job);
    }, [item.job, onDeleteJob]);

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
              {item.email ? (
                <AppText variant="bodySmall" tone="muted">
                  {item.email}
                </AppText>
              ) : null}
            </View>

            <View style={styles.cardRight}>
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

              <Menu
                visible={personMenuVisible}
                onDismiss={handleCloseMenu}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={handleOpenMenu}
                  />
                }
              >
                <Menu.Item
                  leadingIcon="account-edit-outline"
                  onPress={handleEditPerson}
                  title="Edit person"
                />
                <Menu.Item
                  leadingIcon="trash-can-outline"
                  onPress={handleDeletePerson}
                  title="Delete person"
                />
              </Menu>
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
                <View style={styles.jobActions}>
                  <IconButton
                    icon="pencil-outline"
                    size={18}
                    iconColor={primary}
                    onPress={handleEditJob}
                    style={styles.jobActionIcon}
                  />
                  <IconButton
                    icon="trash-can-outline"
                    size={18}
                    iconColor={primary}
                    onPress={handleDeleteJob}
                    style={styles.jobActionIcon}
                  />
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
    deletePerson,
    deleteJob,
    isDeletingPerson,
    isDeletingJob,
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
      deletePerson: state.deletePerson,
      deleteJob: state.deleteJob,
      isDeletingPerson: state.isDeletingPerson,
      isDeletingJob: state.isDeletingJob,
    })),
  );

  const [localSearch, setLocalSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [jobsModalVisible, setJobsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
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
  const deleteTargetName = useMemo(() => {
    if (!deleteTarget) return '';

    if (deleteTarget.type === 'person') {
      return (
        deleteTarget.item.name ||
        deleteTarget.item.full_name ||
        'Unnamed person'
      );
    }

    return deleteTarget.item.title || deleteTarget.item.name || 'Unnamed job';
  }, [deleteTarget]);
  const deleteTargetDescription = useMemo(() => {
    if (!deleteTarget) return '';

    return deleteTarget.type === 'person'
      ? 'This person will be permanently removed from Directus.'
      : 'This job will be permanently removed from Directus. People linked to it may lose their job details.';
  }, [deleteTarget]);

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

  const handleJobSelect = useCallback(
    (job?: Job) => {
      if (job) {
        setSelectedJobId(String(job.id));
        setSelectedJobText(job.title || job.name || 'Selected job');
      } else {
        setSelectedJobId(undefined);
        setSelectedJobText('All jobs');
      }

      setMenuVisible(false);
    },
    [setSelectedJobId],
  );

  const handleEndReached = useCallback(() => {
    if (!hasMorePeople || isFetchingMore || loadMoreError) return;

    fetchMorePeople();
  }, [fetchMorePeople, hasMorePeople, isFetchingMore, loadMoreError]);

  const handleAnimatedHeaderLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextHeaderHeight = event.nativeEvent.layout.height;

      if (Math.abs(nextHeaderHeight - headerHeight) > 1) {
        setHeaderHeight(nextHeaderHeight);
      }
    },
    [headerHeight],
  );

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

  const handleOpenJobsModal = useCallback(() => {
    setCreateMenuVisible(false);
    setJobsModalVisible(true);
  }, []);

  const handleCloseJobsModal = useCallback(() => {
    setJobsModalVisible(false);
  }, []);

  const handleEditPerson = useCallback(
    (person: Person) => {
      navigation.navigate('CreatePerson', { person });
    },
    [navigation],
  );

  const handleEditJob = useCallback(
    (job: Job) => {
      setJobsModalVisible(false);
      navigation.navigate('CreateJob', { job });
    },
    [navigation],
  );

  const handleAskDeletePerson = useCallback((person: Person) => {
    setDeleteTarget({ type: 'person', item: person });
  }, []);

  const handleAskDeleteJob = useCallback((job: Job) => {
    setDeleteTarget({ type: 'job', item: job });
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'person') {
        const name =
          deleteTarget.item.name || deleteTarget.item.full_name || 'The person';

        await deletePerson(deleteTarget.item.id);
        showSuccessToast({
          text1: 'Person deleted',
          text2: `${name} has been removed.`,
        });
      } else {
        const title =
          deleteTarget.item.title || deleteTarget.item.name || 'The job';

        await deleteJob(deleteTarget.item.id);
        showSuccessToast({
          text1: 'Job deleted',
          text2: `${title} has been removed.`,
        });
      }

      setDeleteTarget(null);
    } catch (error) {
      if (isForbiddenError(error)) return;

      showErrorToast({
        text1:
          deleteTarget.type === 'person'
            ? 'Unable to delete person'
            : 'Unable to delete job',
        text2: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, [deleteJob, deletePerson, deleteTarget]);

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
          onEditPerson={handleEditPerson}
          onDeletePerson={handleAskDeletePerson}
          onEditJob={handleEditJob}
          onDeleteJob={handleAskDeleteJob}
        />
      );
    },
    [
      handleAskDeleteJob,
      handleAskDeletePerson,
      handleEditJob,
      handleEditPerson,
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
                  <Divider />
                  <Menu.Item
                    leadingIcon="briefcase-edit-outline"
                    onPress={handleOpenJobsModal}
                    title="Manage jobs"
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

      <Portal>
        <Modal
          visible={jobsModalVisible}
          onDismiss={handleCloseJobsModal}
          contentContainerStyle={[
            styles.jobsModal,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.custom.metrics.radius.xl,
            },
          ]}
        >
          <View style={styles.jobsModalHeader}>
            <View style={styles.jobsModalTitle}>
              <AppText variant="headlineSmall" weight="bold">
                Manage jobs
              </AppText>
              <AppText variant="bodyMedium" tone="secondary">
                Edit or remove professions from Directus.
              </AppText>
            </View>
            <IconButton icon="close" onPress={handleCloseJobsModal} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {jobs.length === 0 ? (
              <ScreenEmpty message="No jobs found" />
            ) : (
              jobs.map(job => (
                <View
                  key={job.id}
                  style={[
                    styles.manageJobCard,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderRadius: theme.custom.metrics.radius.md,
                    },
                  ]}
                >
                  <View style={styles.manageJobCopy}>
                    <AppText variant="titleMedium" weight="bold">
                      {job.title || job.name || `Job ${job.id}`}
                    </AppText>
                    {job.description ? (
                      <AppText variant="bodySmall" tone="secondary">
                        {job.description}
                      </AppText>
                    ) : (
                      <AppText variant="bodySmall" tone="muted">
                        No description
                      </AppText>
                    )}
                  </View>

                  <View style={styles.manageJobActions}>
                    <IconButton
                      icon="pencil-outline"
                      size={20}
                      onPress={() => handleEditJob(job)}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      onPress={() => handleAskDeleteJob(job)}
                    />
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </Modal>

        <Dialog
          visible={Boolean(deleteTarget)}
          onDismiss={handleCancelDelete}
          style={[
            styles.deleteDialog,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.custom.metrics.radius.md,
            },
          ]}
        >
          <Dialog.Content style={styles.deleteDialogContent}>
            <View
              style={[
                styles.deleteIconBadge,
                {
                  backgroundColor: theme.colors.errorContainer,
                },
              ]}
            >
              <IconButton
                icon={
                  deleteTarget?.type === 'person'
                    ? 'account-remove-outline'
                    : 'briefcase-remove-outline'
                }
                size={28}
                iconColor={theme.colors.onErrorContainer}
                style={styles.deleteIcon}
              />
            </View>

            <AppText
              variant="headlineSmall"
              weight="bold"
              style={styles.deleteTitle}
            >
              {deleteTarget?.type === 'person'
                ? 'Delete this person?'
                : 'Delete this job?'}
            </AppText>

            <View
              style={[
                styles.deleteNamePill,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <AppText
                variant="labelLarge"
                weight="bold"
                style={styles.deleteName}
              >
                {deleteTargetName}
              </AppText>
            </View>

            <AppText
              variant="bodyMedium"
              tone="secondary"
              style={styles.deleteDescription}
            >
              {deleteTargetDescription}
            </AppText>
          </Dialog.Content>

          <Dialog.Actions style={styles.deleteActions}>
            <AppButton
              variant="ghost"
              onPress={handleCancelDelete}
              fullWidth
              disabled={isDeletingPerson || isDeletingJob}
              style={styles.deleteActionButton}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="danger"
              onPress={handleConfirmDelete}
              fullWidth
              loading={isDeletingPerson || isDeletingJob}
              style={styles.deleteActionButton}
            >
              Delete
            </AppButton>
          </Dialog.Actions>
        </Dialog>
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
  cardRight: {
    alignItems: 'center',
    flexDirection: 'row',
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
  jobActions: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  jobActionIcon: {
    margin: 0,
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
  jobsModal: {
    margin: 20,
    maxHeight: '82%',
    padding: 20,
  },
  jobsModalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  jobsModalTitle: {
    flex: 1,
    paddingRight: 12,
  },
  manageJobCard: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  manageJobCopy: {
    flex: 1,
    paddingRight: 8,
  },
  manageJobActions: {
    flexDirection: 'row',
  },
  deleteDialog: {
    marginHorizontal: 24,
  },
  deleteDialogContent: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 24,
  },
  deleteIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  deleteIcon: {
    margin: 0,
  },
  deleteTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteNamePill: {
    borderRadius: 8,
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
  },
  deleteName: {
    textAlign: 'center',
  },
  deleteDescription: {
    lineHeight: 21,
    textAlign: 'center',
  },
  deleteActions: {
    gap: 10,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  deleteActionButton: {
    flex: 1,
  },
});

export default DataScreen;
