import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Card,
  Button,
  Portal,
  Modal,
  Menu,
  useTheme,
  ActivityIndicator,
  Divider,
  Surface,
  IconButton,
} from 'react-native-paper';
import { useDataStore, Person, Job } from '../store/useDataStore';
import { ScreenContainer } from '../components/ScreenContainer';

const DataScreen = () => {
  const theme = useTheme();

  const {
    people,
    jobs,
    isLoadingPeople,
    isLoadingJobs,
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
    return (
      <Card style={styles.card} mode="elevated" elevation={2}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text variant="titleLarge" style={styles.personName}>
                {item.name}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                Tuổi: {item.age || 'Chưa cung cấp'}
              </Text>
            </View>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
               <Text style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
                 {item.name ? item.name.charAt(0).toUpperCase() : '?'}
               </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {item.job && (
            <View style={[styles.jobContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View style={styles.jobRow}>
                <IconButton icon="briefcase" size={20} iconColor={theme.colors.primary} style={styles.jobIcon} />
                <View style={{ flex: 1 }}>
                  <Text variant="labelLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurfaceVariant }}>
                    {item.job.title || item.job.name || 'Chưa có chức danh'}
                  </Text>
                  {item.job.description && (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8, marginTop: 2 }}>
                      {item.job.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          <Image
            source={require('../assets/hue.jpg')}
            style={styles.jobImage}
            resizeMode="cover"
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScreenContainer paddingHorizontal={0}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Cộng đồng
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          Thêm
        </Button>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Tìm theo tên..."
          value={localSearch}
          onChangeText={setLocalSearch}
          mode="outlined"
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
          theme={{ roundness: 12 }}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained-tonal"
              onPress={() => setMenuVisible(true)}
              style={styles.menuAnchor}
              icon="chevron-down"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              {selectedJobText}
            </Button>
          }
        >
          <Menu.Item onPress={() => handleJobSelect(undefined)} title="Tất cả công việc" />
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
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderPerson}
          contentContainerStyle={styles.listContainer}
          onEndReached={fetchMorePeople}
          onEndReachedThreshold={0.5}
          refreshing={isLoadingPeople && people.length > 0}
          onRefresh={() => fetchPeople()}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: theme.colors.outline }}>Không có dữ liệu</Text>
            </View>
          }
        />
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Thêm hồ sơ mới
            </Text>
            
            <Text variant="bodyMedium" style={{ marginBottom: 20, color: theme.colors.outline }}>
              Nhập thông tin chi tiết vào bên dưới
            </Text>

            <TextInput
              label="Tên"
              mode="outlined"
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
              theme={{ roundness: 12 }}
            />
            <TextInput
              label="Tuổi"
              mode="outlined"
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="numeric"
              style={styles.modalInput}
              theme={{ roundness: 12 }}
            />

            <TextInput
              label="Công việc (chỉ giao diện)"
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              style={styles.modalInput}
              theme={{ roundness: 12 }}
            />

            <View style={styles.modalActions}>
              <Button mode="text" onPress={() => setModalVisible(false)} textColor={theme.colors.outline}>
                Huỷ
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  Alert.alert('Chức năng thêm mới chỉ để hiển thị giao diện!');
                  setModalVisible(false);
                }}
                style={{ borderRadius: 12 }}
              >
                Lưu hồ sơ
              </Button>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  addButton: {
    borderRadius: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    marginBottom: 12,
    height: 52,
  },
  menuAnchor: {
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontWeight: 'bold',
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
    opacity: 0.5,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    padding: 24,
    margin: 20,
    borderRadius: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
});

export default DataScreen;
