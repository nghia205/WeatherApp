import React, { useEffect, useState, useCallback } from 'react';
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
  DataTable,
  useTheme,
  ActivityIndicator,
  Divider,
  Surface,
} from 'react-native-paper';
import { useDataStore, Person, Job } from '../store/useDataStore';

const DataScreen = () => {
  const theme = useTheme();

  const {
    people,
    jobs,
    page,
    limit,
    totalCount,
    isLoadingPeople,
    isLoadingJobs,
    setPage,
    setLimit,
    setSearchName,
    setSelectedJobId,
    fetchJobs,
    fetchPeople,
  } = useDataStore();

  // Local state cho debounce search
  const [localSearch, setLocalSearch] = useState('');

  // Local state cho Menu (Select Job)
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedJobText, setSelectedJobText] = useState('Tất cả công việc');

  // Local state cho Modal Form Add New
  const [modalVisible, setModalVisible] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchPeople();
  }, []); // Chỉ chạy lần đầu

  // Debounce search name
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchName(localSearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchName]);

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
    const jobImage = item.job?.image
      ? `https://silvatek.vn:8080/assets/${item.job.image}`
      : null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: 'bold', marginBottom: 4 }}
          >
            {item.full_name}
          </Text>
          <Text variant="bodyMedium" style={styles.textWrap}>
            Email: {item.email}
          </Text>
          <Text variant="bodyMedium" style={styles.textWrap}>
            SĐT: {item.phone || 'Chưa cung cấp'}
          </Text>

          <Divider style={styles.divider} />

          {item.job && (
            <View style={styles.jobContainer}>
              <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>
                Thông tin công việc:
              </Text>
              <Text variant="bodyMedium" style={styles.textWrap}>
                {item.job.title || item.job.name || 'Chưa có chức danh'}
              </Text>
              {item.job.description && (
                <Text
                  variant="bodySmall"
                  style={[styles.textWrap, { marginTop: 4, opacity: 0.7 }]}
                >
                  {item.job.description}
                </Text>
              )}
              {jobImage ? (
                <Image
                  source={{ uri: jobImage }}
                  style={styles.jobImage}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const itemsPerPageOptions = [10, 20, 50, 100];
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header & Button Thêm mới */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
          Dữ liệu People
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => setModalVisible(true)}
        >
          Thêm mới
        </Button>
      </View>

      {/* Filter Panel */}
      <Surface style={styles.filterPanel} elevation={1}>
        <TextInput
          label="Tìm theo tên..."
          value={localSearch}
          onChangeText={setLocalSearch}
          mode="outlined"
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.menuAnchor}
              icon="chevron-down"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              {selectedJobText}
            </Button>
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
      </Surface>

      {/* List content */}
      {isLoadingPeople ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={item => String(item.id)}
          renderItem={renderPerson}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text>Không có dữ liệu</Text>
            </View>
          }
        />
      )}

      {/* Pagination */}
      <Surface elevation={2} style={styles.paginationContainer}>
        <DataTable.Pagination
          page={page - 1} // 0-indexed cho DataTable.Pagination
          numberOfPages={totalPages}
          onPageChange={pageIndex => setPage(pageIndex + 1)}
          label={`${(page - 1) * limit + 1}-${Math.min(
            page * limit,
            totalCount,
          )} của ${totalCount}`}
          showFastPaginationControls
          numberOfItemsPerPageList={itemsPerPageOptions}
          numberOfItemsPerPage={limit}
          onItemsPerPageChange={setLimit}
          selectPageDropdownLabel={'Hiển thị'}
        />
      </Surface>

      {/* Modal Add New */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView>
            <Text
              variant="titleLarge"
              style={{ marginBottom: 16, fontWeight: 'bold' }}
            >
              Thêm hồ sơ mới
            </Text>

            <TextInput
              label="Họ và tên"
              mode="outlined"
              value={newFullName}
              onChangeText={setNewFullName}
              style={styles.modalInput}
            />
            <TextInput
              label="Email"
              mode="outlined"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              style={styles.modalInput}
            />
            <TextInput
              label="Số điện thoại"
              mode="outlined"
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
              style={styles.modalInput}
            />

            {/* Chỉ làm giao diện cho dropdown job */}
            <TextInput
              label="Công việc (chỉ giao diện)"
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
              style={styles.modalInput}
            />

            <View style={styles.modalActions}>
              <Button mode="text" onPress={() => setModalVisible(false)}>
                Huỷ
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  Alert.alert('Chức năng thêm mới chỉ để hiển thị giao diện!');
                  setModalVisible(false);
                }}
              >
                Lưu
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // để tránh status bar nêú có
  },
  filterPanel: {
    padding: 16,
    marginBottom: 8,
  },
  searchInput: {
    marginBottom: 12,
  },
  menuAnchor: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 12,
  },
  jobContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 8,
  },
  textWrap: {
    flexShrink: 1,
  },
  jobImage: {
    width: '100%',
    height: 150,
    marginTop: 12,
    borderRadius: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  modalCard: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
});

export default DataScreen;
