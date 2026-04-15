import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
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
}: FormInputProps<T>) => {
  return (
    <View style={{ marginBottom: 4 }}>
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
            />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </>
        )}
      />
    </View>
  );
};
