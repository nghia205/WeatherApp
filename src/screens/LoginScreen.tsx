import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import * as z from 'zod';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { useAppTheme } from '../theme/useAppTheme';
import { FormInput } from '../components/FormInput';
import { AppButton } from '../components/ui/AppButton';
import { AppText } from '../components/ui/AppText';

const loginSchema = z.object({
  email: z
    .string({ message: 'Please enter text' })
    .min(1, 'Email is required')
    .email('Email format is invalid'),
  password: z
    .string({ message: 'Please enter text' })
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const noop = () => {};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore(state => state.login);
  const theme = useAppTheme();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'user1@gmail.com', password: 'User1@1327' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const responseData = await authService.login({
        email: data.email,
        password: data.password,
      });

      const loginData = responseData.data;

      login({
        user: loginData,
        token: loginData.access_token,
        tokenExpires: loginData.expires,
        refreshToken: loginData.refresh_token,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign-in failed',
        text2: 'The email or password is incorrect',
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.flex1, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View
                style={[
                  styles.iconPlaceholder,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <AppText style={styles.iconText}>W</AppText>
              </View>

              <AppText
                variant="headlineLarge"
                weight="heavy"
                style={styles.title}
              >
                WeatherApp
              </AppText>

              <AppText variant="bodyLarge" tone="secondary" weight="medium">
                Sign in to view today's weather
              </AppText>
            </View>

            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.custom.semantic.border.subtle,
                  borderRadius: theme.custom.metrics.radius.xxl,
                },
              ]}
            >
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                left={
                  <TextInput.Icon
                    icon="email-outline"
                    color={theme.colors.onSurfaceVariant}
                  />
                }
              />

              <View style={styles.fieldSpacer} />

              <FormInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                left={
                  <TextInput.Icon
                    icon="lock-outline"
                    color={theme.colors.onSurfaceVariant}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(value => !value)}
                    color={theme.colors.onSurfaceVariant}
                  />
                }
              />

              <View style={styles.forgotPasswordContainer}>
                <AppButton
                  variant="ghost"
                  compact
                  fullWidth={false}
                  onPress={noop}
                >
                  Forgot password?
                </AppButton>
              </View>

              <AppButton
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                Sign in
              </AppButton>
            </View>

            <View style={styles.footerContainer}>
              <AppText variant="bodyMedium" tone="secondary" weight="medium">
                Do not have an account?
              </AppText>

              <AppButton
                variant="ghost"
                compact
                fullWidth={false}
                onPress={noop}
              >
                Sign up
              </AppButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  formCard: {
    borderWidth: 1.5,
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  fieldSpacer: {
    height: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 28,
    marginTop: -8,
  },
  submitButton: {
    borderRadius: 999,
  },
  submitButtonContent: {
    height: 56,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
