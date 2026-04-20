import React, { memo } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextInputProps } from 'react-native-paper';

import { AppTextInput } from './ui/AppTextInput';

type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
};

function FormInputComponent<T extends FieldValues>({
  control,
  name,
  ...rest
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <AppTextInput
          {...rest}
          value={value as string}
          onBlur={onBlur}
          onChangeText={onChange}
          error={!!error}
          placeholderTextColor={undefined}
        />
      )}
    />
  );
}

export const FormInput = memo(FormInputComponent) as typeof FormInputComponent;
