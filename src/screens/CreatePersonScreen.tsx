import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, IconButton, Menu, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { AppTextInput } from '../components/ui/AppTextInput';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Job, Person, useDataStore } from '../store/useDataStore';
import { showErrorToast, showSuccessToast } from '../utils/showToast';
import { isForbiddenError } from '../utils/apiError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const route = useRoute<any>();
  const editingPerson = route.params?.person as Person | undefined;
  const isEditing = Boolean(editingPerson);
  const {
    jobs,
    isLoadingJobs,
    isCreatingPerson,
    fetchJobs,
    createPerson,
    updatePerson,
  } = useDataStore(
    useShallow(state => ({
      jobs: state.jobs,
      isLoadingJobs: state.isLoadingJobs,
      isCreatingPerson: state.isCreatingPerson,
      fetchJobs: state.fetchJobs,
      createPerson: state.createPerson,
      updatePerson: state.updatePerson,
    })),
  );

  const [name, setName] = useState(
    editingPerson?.name || editingPerson?.full_name || '',
  );
  const [age, setAge] = useState(
    editingPerson?.age ? String(editingPerson.age) : '',
  );
  const [email, setEmail] = useState(editingPerson?.email || '');
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(
    editingPerson?.job,
  );
  const [jobMenuVisible, setJobMenuVisible] = useState(false);

  const trimmedName = name.trim();
  const trimmedAge = age.trim();
  const trimmedEmail = email.trim();
  const isEmailValid = !trimmedEmail || EMAIL_PATTERN.test(trimmedEmail);
  const emailError =
    trimmedEmail && !isEmailValid ? 'Email format is invalid.' : undefined;
  const canSubmit =
    trimmedName.length > 0 && isEmailValid && !isCreatingPerson;

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
      showErrorToast({
        text1: 'Missing name',
        text2: 'Enter a person name before saving.',
      });
      return;
    }

    const parsedAge = trimmedAge ? Number(trimmedAge) : undefined;

    if (trimmedAge && Number.isNaN(parsedAge)) {
      showErrorToast({
        text1: 'Invalid age',
        text2: 'Age must be a number.',
      });
      return;
    }

    if (!isEmailValid) {
      showErrorToast({
        text1: 'Invalid email',
        text2: 'Enter a valid email address before saving.',
      });
      return;
    }

    try {
      if (isEditing && editingPerson) {
        await updatePerson(editingPerson.id, {
          name: trimmedName,
          age: parsedAge ?? null,
          email: trimmedEmail || null,
          job: selectedJob?.id ?? null,
        });

        showSuccessToast({
          text1: 'Person updated',
          text2: `${trimmedName} has been updated.`,
        });
        navigation.goBack();
        return;
      }

      await createPerson({
        name: trimmedName,
        age: parsedAge,
        email: trimmedEmail || undefined,
        job: selectedJob?.id,
      });

      showSuccessToast({
        text1: 'Person created',
        text2: selectedJob
          ? `${trimmedName} has been saved with ${getJobLabel(selectedJob)}.`
          : `${trimmedName} has been saved.`,
      });
      navigation.goBack();
    } catch (error) {
      if (isForbiddenError(error)) return;

      showErrorToast({
        text1: isEditing
          ? 'Unable to update person'
          : 'Unable to create person',
        text2: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, [
    createPerson,
    editingPerson,
    isEditing,
    navigation,
    selectedJob,
    isEmailValid,
    trimmedAge,
    trimmedEmail,
    trimmedName,
    updatePerson,
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
          title={isEditing ? 'Edit person' : 'Create person'}
          subtitle={
            isEditing
              ? 'Update person details in Directus.'
              : 'Save a person and attach an existing job.'
          }
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
              error={Boolean(emailError)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {emailError ? (
              <AppText variant="bodySmall" tone="danger" style={styles.error}>
                {emailError}
              </AppText>
            ) : null}

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
              <AppButton
                variant="ghost"
                onPress={handleBack}
                fullWidth
                style={styles.actionButton}
              >
                Cancel
              </AppButton>

              <AppButton
                variant="primary"
                onPress={handleCreatePerson}
                disabled={!canSubmit}
                loading={isCreatingPerson || isLoadingJobs}
                fullWidth
                style={styles.actionButton}
              >
                {isEditing ? 'Update person' : 'Save person'}
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
  error: {
    marginTop: -10,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});

export default memo(CreatePersonScreen);
