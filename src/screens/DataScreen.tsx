import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Card,
  Divider,
  IconButton,
  List,
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
import { ScreenLoading } from '../components/feedback/ScreenLoading';
import { useAppTheme } from '../theme/useAppTheme';

const DataScreen = () => {
  const theme = useAppTheme();

  const {
    people,
    jobs,
    isLoadingPeople,
    isFetchingMore,
    setSearchName,
    setSelectedJobId,
    fetchJobs,
    fetchPeople,
    fetchMorePeople,
    searchName,
  } = useDataStore();

  const [localSearch, setLocalSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedJobText, setSelectedJobText] = useState('Tất cả công việc');

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

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
      setSelectedJobText(job.title || job.name || 'Công việc đã chọn');
    } else {
      setSelectedJobId(undefined);
      setSelectedJobText('Tất cả công việc');
    }
    setMenuVisible(false);
  };

  const renderPerson = ({ item }: { item: Person }) => {
    const name = item.name || 'Người dùng';
    const firstChar = name.charAt(0).toUpperCase();

    return (
      <AppCard variant="elevated" style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <View>
              <AppText
                variant="titleLarge"
                weight="bold"
                style={styles.personName}
              >
                {name}
              </AppText>
              <AppText variant="bodyMedium" tone="secondary">
                Tuổi: {item.age || 'Chưa cung cấp'}
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
                  icon="briefcase"
                  size={20}
                  iconColor={theme.colors.primary}
                  style={styles.jobIcon}
                />
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="labelLarge"
                    weight="bold"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {item.job.title || item.job.name || 'Chưa có chức danh'}
                  </AppText>
                  {item.job.description ? (
                    <AppText
                      variant="bodySmall"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        opacity: 0.8,
                        marginTop: 2,
                      }}
                    >
                      {item.job.description}
                    </AppText>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}

          <Image
            source={require('../assets/hue.jpg')}
            style={styles.jobImage}
            resizeMode="cover"
          />
        </Card.Content>
      </AppCard>
    );
  };

  return (
    <ScreenContainer paddingHorizontal={0}>
      <View style={styles.header}>
        <SectionHeader
          title="Cộng đồng"
          style={{ marginBottom: 8 }}
          action={
            <AppButton
              variant="primary"
              icon="plus"
              onPress={() => setModalVisible(true)}
              fullWidth={false}
            >
              Thêm
            </AppButton>
          }
        />
      </View>

      <View style={styles.filterContainer}>
        <AppTextInput
          placeholder="Tìm theo tên..."
          value={localSearch}
          onChangeText={setLocalSearch}
          left={<TextInput.Icon icon="magnify" />}
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
            >
              {selectedJobText}
            </AppButton>
          }
        >
          <Menu.Item
            onPress={() => handleJobSelect(undefined)}
            title="Tất cả công việc"
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
      </View>

      {isLoadingPeople && people.length === 0 ? (
        <ScreenLoading message="Đang tải danh sách..." />
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderPerson}
          contentContainerStyle={styles.listContainer}
          onEndReached={fetchMorePeople}
          onEndReachedThreshold={0.5}
          refreshing={isLoadingPeople && people.length > 0}
          onRefresh={() => fetchPeople()}
          ListFooterComponent={
            isFetchingMore ? <ScreenLoading message="Đang tải thêm..." /> : null
          }
          ListEmptyComponent={<ScreenEmpty message="Không có dữ liệu" />}
        />
      )}

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
              Thêm hồ sơ mới
            </AppText>

            <AppText
              variant="bodyMedium"
              tone="muted"
              style={{ marginBottom: 20, marginTop: 6 }}
            >
              Nhập thông tin chi tiết vào bên dưới
            </AppText>

            <AppTextInput
              label="Tên"
              value={newName}
              onChangeText={setNewName}
            />

            <AppTextInput
              label="Tuổi"
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="numeric"
            />

            <AppTextInput
              label="Công việc (chỉ giao diện)"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />

            <View style={styles.modalActions}>
              <AppButton
                variant="ghost"
                onPress={() => setModalVisible(false)}
                fullWidth={false}
              >
                Huỷ
              </AppButton>

              <AppButton
                variant="primary"
                onPress={() => {
                  Alert.alert('Chức năng thêm mới chỉ để hiển thị giao diện!');
                  setModalVisible(false);
                }}
                fullWidth={false}
              >
                Lưu hồ sơ
              </AppButton>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  jobImage: {
    width: '100%',
    height: 160,
    marginTop: 16,
    borderRadius: 12,
  },
  modalCard: {
    padding: 24,
    margin: 20,
    maxHeight: '80%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
});

export default DataScreen;
