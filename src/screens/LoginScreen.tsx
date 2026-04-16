import React, { useState } from 'react';
import {
  ImageBackground,
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

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&q=80';

const loginSchema = z.object({
  email: z
    .string({ message: 'Vui lòng nhập định dạng chữ' })
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string({ message: 'Vui lòng nhập định dạng chữ' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
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
        text1: 'Lỗi đăng nhập',
        text2: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }
  };

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      style={styles.backgroundImage}
      blurRadius={Platform.OS === 'ios' ? 10 : 5}
    >
      <SafeAreaView
        style={[
          styles.flex1,
          { backgroundColor: theme.custom.semantic.alpha.overlay },
        ]}
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
                  <AppText style={styles.iconText}>🌤</AppText>
                </View>

                <AppText
                  variant="headlineLarge"
                  weight="heavy"
                  style={styles.title}
                >
                  WeatherApp
                </AppText>

                <AppText variant="bodyLarge" tone="secondary" weight="medium">
                  Đăng nhập để xem thời tiết hôm nay
                </AppText>
              </View>

              <View
                style={[
                  styles.glassCard,
                  {
                    backgroundColor: theme.custom.semantic.alpha.glass,
                    borderColor: theme.custom.semantic.alpha.glassBorder,
                    borderRadius: theme.custom.metrics.radius.xxl,
                  },
                ]}
              >
                <FormInput
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="Nhập địa chỉ email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={
                    <TextInput.Icon
                      icon="email-outline"
                      color={theme.colors.onSurfaceVariant}
                    />
                  }
                />

                <View style={{ height: 4 }} />

                <FormInput
                  control={control}
                  name="password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
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
                      onPress={() => setShowPassword(!showPassword)}
                      color={theme.colors.onSurfaceVariant}
                    />
                  }
                />

                <View style={styles.forgotPasswordContainer}>
                  <AppButton
                    variant="ghost"
                    compact
                    fullWidth={false}
                    onPress={() => {}}
                  >
                    Quên mật khẩu?
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
                  Đăng Nhập
                </AppButton>
              </View>

              <View style={styles.footerContainer}>
                <AppText variant="bodyMedium" tone="secondary" weight="medium">
                  Bạn chưa có tài khoản?
                </AppText>

                <AppButton
                  variant="ghost"
                  compact
                  fullWidth={false}
                  onPress={() => {}}
                >
                  Đăng ký ngay
                </AppButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
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
    fontSize: 32,
  },
  title: {
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  glassCard: {
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
