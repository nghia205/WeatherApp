import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, IconButton, Menu, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppTextInput } from '../components/ui/AppTextInput';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Job, useDataStore } from '../store/useDataStore';

const getJobLabel = (job?: Job) => {
  if (!job) return 'No job selected';

  return job.title || job.name || `Job ${job.id}`;
};

type JobMenuItemProps = {
  job: Job;
  onSelect: (job: Job) => void;
};

const JobMenuItem = memo(({ job, onSelect }: JobMenuItemProps) => {
  const handlePress = useCallback(() => {
    onSelect(job);
  }, [job, onSelect]);

  return <Menu.Item onPress={handlePress} title={getJobLabel(job)} />;
});

const CreatePersonScreen = () => {
  const navigation = useNavigation();
  const {
    jobs,
    isLoadingJobs,
    isCreatingPerson,
    fetchJobs,
    createPerson,
  } = useDataStore(
    useShallow(state => ({
      jobs: state.jobs,
      isLoadingJobs: state.isLoadingJobs,
      isCreatingPerson: state.isCreatingPerson,
      fetchJobs: state.fetchJobs,
      createPerson: state.createPerson,
    })),
  );

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | undefined>();
  const [jobMenuVisible, setJobMenuVisible] = useState(false);

  const trimmedName = name.trim();
  const trimmedAge = age.trim();
  const trimmedEmail = email.trim();
  const canSubmit = trimmedName.length > 0 && !isCreatingPerson;

  const selectedJobLabel = useMemo(
    () => getJobLabel(selectedJob),
    [selectedJob],
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openJobMenu = useCallback(() => {
    setJobMenuVisible(true);
  }, []);

  const closeJobMenu = useCallback(() => {
    setJobMenuVisible(false);
  }, []);

  const handleJobSelect = useCallback((job: Job) => {
    setSelectedJob(job);
    setJobMenuVisible(false);
  }, []);

  const handleClearJob = useCallback(() => {
    setSelectedJob(undefined);
    setJobMenuVisible(false);
  }, []);

  const handleCreatePerson = useCallback(async () => {
    if (!trimmedName) {
      Alert.alert('Missing name', 'Enter a person name before saving.');
      return;
    }

    const parsedAge = trimmedAge ? Number(trimmedAge) : undefined;

    if (trimmedAge && Number.isNaN(parsedAge)) {
      Alert.alert('Invalid age', 'Age must be a number.');
      return;
    }

    try {
      await createPerson({
        name: trimmedName,
        age: parsedAge,
        email: trimmedEmail || undefined,
        job: selectedJob?.id,
      });

      Alert.alert('Person created', 'The person has been saved.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to create person',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }, [
    createPerson,
    navigation,
    selectedJob?.id,
    trimmedAge,
    trimmedEmail,
    trimmedName,
  ]);

  const jobRightIcon = useMemo(
    () => <TextInput.Icon icon="menu-down" onPress={openJobMenu} />,
    [openJobMenu],
  );

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SectionHeader
          title="Create person"
          subtitle="Save a person and attach an existing job."
          action={
            <IconButton icon="arrow-left" size={24} onPress={handleBack} />
          }
        />

        <AppCard variant="elevated">
          <View style={styles.form}>
            <AppTextInput
              label="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <AppTextInput
              label="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              returnKeyType="next"
            />

            <AppTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />

            <Menu
              visible={jobMenuVisible}
              onDismiss={closeJobMenu}
              anchor={
                <AppTextInput
                  label="Job"
                  value={selectedJobLabel}
                  editable={false}
                  right={jobRightIcon}
                  onPressIn={openJobMenu}
                />
              }
            >
              <Menu.Item onPress={handleClearJob} title="No job selected" />
              <Divider />
              {jobs.map(job => (
                <JobMenuItem
                  key={job.id}
                  job={job}
                  onSelect={handleJobSelect}
                />
              ))}
            </Menu>

            <View style={styles.actions}>
              <AppButton variant="ghost" onPress={handleBack} fullWidth={false}>
                Cancel
              </AppButton>

              <AppButton
                variant="primary"
                onPress={handleCreatePerson}
                disabled={!canSubmit}
                loading={isCreatingPerson || isLoadingJobs}
                fullWidth={false}
              >
                Save person
              </AppButton>
            </View>
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    paddingTop: 24,
  },
  form: {
    padding: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default memo(CreatePersonScreen);
