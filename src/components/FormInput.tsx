import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  right,
  left,
}: FormInputProps<T>) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              mode="outlined"
              label={label}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string}
              error={!!error}
              right={right}
              left={left}
              outlineStyle={{ borderRadius: 16 }}
              style={{ backgroundColor: theme.dark ? 'rgba(15, 23, 42, 0.4)' : 'transparent' }}
            />
            <HelperText type="error" visible={!!error} style={{ paddingHorizontal: 0 }}>
              {error?.message}
            </HelperText>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
});
