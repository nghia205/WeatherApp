import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { FormInput } from '../components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import Toast from 'react-native-toast-message';

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
    formState: { errors },
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
        text2: 'Sever error',
      });
    }
  };

  return (
    // Kết hợp style tĩnh và style động (Theme)
    <SafeAreaView
      style={[styles.flex1, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={[styles.flex1, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.container,
              { backgroundColor: theme.colors.background },
            ]}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text
                variant="headlineLarge"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                Chào mừng trở lại!
              </Text>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Vui lòng đăng nhập để tiếp tục
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="Nhập địa chỉ email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormInput
                control={control}
                name="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                secureTextEntry
              />

              {/* Forgot Password */}
              <View style={styles.forgotPasswordContainer}>
                <Button mode="text" compact onPress={() => {}}>
                  Quên mật khẩu?
                </Button>
              </View>

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                Đăng Nhập
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Bạn chưa có tài khoản?{' '}
              </Text>
              <Button mode="text" compact onPress={() => {}}>
                Đăng ký ngay
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 2. Chuyển toàn bộ Layout tĩnh xuống đây
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
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  submitButton: {
    paddingVertical: 4,
    borderRadius: 12,
  },
  submitButtonContent: {
    height: 50,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
