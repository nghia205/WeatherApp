import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { FormInput } from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import Toast from 'react-native-toast-message';

const BG_IMAGE_URL = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&q=80';

// Định nghĩa schema validation với Zod
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
  const { login } = useAuthStore();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const responseData = await authService.login({
        email: data.email,
        password: data.password,
      });
      const token = responseData.data;
      login(token, token.access_token, token.expires);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi đăng nhập',
        text2: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }
  };

  const overlayColor = theme.dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.4)';

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      style={styles.backgroundImage}
      blurRadius={Platform.OS === 'ios' ? 10 : 5}
    >
      <SafeAreaView style={[styles.flex1, { backgroundColor: overlayColor }]}>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.iconText}>🌤</Text>
                </View>
                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
                  WeatherApp
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                  Đăng nhập để xem thời tiết hôm nay
                </Text>
              </View>

              {/* Form */}
              <Card style={[styles.formCard, { backgroundColor: theme.dark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)' }]} elevation={4}>
                <Card.Content>
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Nhập địa chỉ email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <View style={{ height: 8 }} />

                  <FormInput
                    control={control}
                    name="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu của bạn"
                    secureTextEntry
                  />

                  <View style={styles.forgotPasswordContainer}>
                    <Button mode="text" compact onPress={() => {}} textColor={theme.colors.primary}>
                      Quên mật khẩu?
                    </Button>
                  </View>

                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Đăng Nhập
                  </Button>
                </Card.Content>
              </Card>

              {/* Footer */}
              <View style={styles.footerContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                  Bạn chưa có tài khoản?{' '}
                </Text>
                <Button mode="text" compact onPress={() => {}} textColor={theme.colors.primary}>
                  Đăng ký ngay
                </Button>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  formCard: {
    borderRadius: 24,
    marginBottom: 24,
    paddingVertical: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  submitButton: {
    borderRadius: 16,
  },
  submitButtonContent: {
    height: 52,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
