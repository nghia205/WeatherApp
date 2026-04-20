import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useShallow } from 'zustand/react/shallow';

import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { AppTextInput } from '../components/ui/AppTextInput';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useDataStore } from '../store/useDataStore';
import { useAppTheme } from '../theme/useAppTheme';
import { showErrorToast, showSuccessToast } from '../utils/showToast';

const DEFAULT_MIME_TYPE = 'image/jpeg';

const IMAGE_PICKER_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.8,
};

const getFileNameFromUri = (uri: string) => {
  const cleanUri = uri.split('?')[0];
  const name = cleanUri.split('/').filter(Boolean).pop();

  return name || `job-image-${Date.now()}.jpg`;
};

const getAssetFileName = (asset: Asset) => {
  if (asset.fileName) return asset.fileName;
  if (asset.uri) return getFileNameFromUri(asset.uri);

  return `job-image-${Date.now()}.jpg`;
};

const buildFileFormData = (asset: Asset) => {
  const formData = new FormData();
  const uri = asset.uri;

  if (!uri) {
    throw new Error('Selected image does not include a readable URI.');
  }

  formData.append('file', {
    uri,
    name: getAssetFileName(asset),
    type: asset.type || DEFAULT_MIME_TYPE,
  } as any);

  return formData;
};

const CreateJobScreen = () => {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const lastScrollYRef = useRef(0);

  const { createJob, uploadJobImage, isCreatingJob } = useDataStore(
    useShallow(state => ({
      createJob: state.createJob,
      uploadJobImage: state.uploadJobImage,
      isCreatingJob: state.isCreatingJob,
    })),
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && !isCreatingJob;

  const selectedImageName = useMemo(
    () => (selectedImage ? getAssetFileName(selectedImage) : 'No image chosen'),
    [selectedImage],
  );

  const imagePreviewSource = useMemo(
    () => (selectedImage?.uri ? { uri: selectedImage.uri } : undefined),
    [selectedImage?.uri],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      lastScrollYRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const handlePickImage = useCallback(async () => {
    try {
      const response = await launchImageLibrary(IMAGE_PICKER_OPTIONS);

      if (response.didCancel) return;

      if (response.errorCode) {
        showErrorToast({
          text1: 'Unable to pick image',
          text2: response.errorMessage || response.errorCode,
        });
        return;
      }

      const asset = response.assets?.[0];

      if (!asset?.uri) {
        showErrorToast({
          text1: 'Unable to pick image',
          text2: 'No image was returned.',
        });
        return;
      }

      setSelectedImage(asset);
    } catch (error) {
      showErrorToast({
        text1: 'Unable to pick image',
        text2: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleCreateJob = useCallback(async () => {
    if (!trimmedTitle) {
      showErrorToast({
        text1: 'Missing title',
        text2: 'Enter a job title before saving.',
      });
      return;
    }

    try {
      let uploadedImageId: string | undefined;

      if (selectedImage) {
        const formData = buildFileFormData(selectedImage);
        uploadedImageId = await uploadJobImage(formData);
      }

      await createJob({
        title: trimmedTitle,
        description: description.trim() || undefined,
        image: uploadedImageId,
      });

      showSuccessToast({
        text1: 'Job created',
        text2: uploadedImageId
          ? 'The job and image have been saved.'
          : 'The job has been saved.',
      });
      navigation.goBack();
    } catch (error) {
      showErrorToast({
        text1: 'Unable to create job',
        text2: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, [
    createJob,
    description,
    navigation,
    selectedImage,
    trimmedTitle,
    uploadJobImage,
  ]);

  const helperTextStyle = useMemo(
    () => [styles.helperText, { color: theme.colors.onSurfaceVariant }],
    [theme.colors.onSurfaceVariant],
  );

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SectionHeader
          title="Create job"
          subtitle="Save a profession and optional image to Directus."
          action={
            <IconButton icon="arrow-left" size={24} onPress={handleBack} />
          }
        />

        <AppCard variant="elevated">
          <View style={styles.form}>
            <AppTextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <AppTextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.multilineInput}
            />

            <AppText variant="titleMedium" weight="bold" style={styles.group}>
              Job image
            </AppText>

            <AppText variant="bodySmall" style={helperTextStyle}>
              Choose a photo from your device library.
            </AppText>

            <View style={styles.imageActions}>
              <AppButton
                variant="secondary"
                icon="image-outline"
                onPress={handlePickImage}
                fullWidth={false}
              >
                Choose image
              </AppButton>

              {selectedImage ? (
                <AppButton
                  variant="ghost"
                  onPress={handleClearImage}
                  fullWidth={false}
                >
                  Remove
                </AppButton>
              ) : null}
            </View>

            <AppText variant="bodySmall" tone="muted" style={styles.fileName}>
              {selectedImageName}
            </AppText>

            {imagePreviewSource ? (
              <Image
                source={imagePreviewSource}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : null}

            <View style={styles.actions}>
              <AppButton variant="ghost" onPress={handleBack} fullWidth={false}>
                Cancel
              </AppButton>

              <AppButton
                variant="primary"
                onPress={handleCreateJob}
                disabled={!canSubmit}
                loading={isCreatingJob}
                fullWidth={false}
              >
                Save job
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
  multilineInput: {
    minHeight: 116,
  },
  group: {
    marginBottom: 8,
    marginTop: 4,
  },
  helperText: {
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fileName: {
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default memo(CreateJobScreen);
