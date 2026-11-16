import React from 'react';

import { View } from 'react-native';

import { router } from 'expo-router';

import {
  PrefabAlert,
  PrefabButton,
  PrefabCard,
  PrefabHeader,
  PrefabInput,
  PrefabLink,
  PrefabSeparator,
} from '@/global/components';

import { pickImageFromGallery } from '@/global/utils/image/image_picker.utils';

import { RegisterAvatar } from '../avatar/register_avatar.component';

import { useRegisterForm } from './hook/register_form.hook';

import { RegisterFormProps } from '../../types/register.types';

export const RegisterFormComponent = ({
  onSubmit,
  isPending,
  errorMessage,
  onClearError,
}: RegisterFormProps) => {
  const { form, localError, updateField, submit, clearError } = useRegisterForm(onSubmit);

  const pickAvatar = async () => {
    const image = await pickImageFromGallery();

    if (!image) {
      return;
    }

    updateField('user_avatar')({
      uri: image.uri,
      mimeType: image.mimeType,
      fileName: image.fileName,
    });
  };

  return (
    <View className="flex-1 justify-center px-6">

        <RegisterAvatar uri={form.user_avatar?.uri} onPress={pickAvatar} />

        <PrefabHeader
          title="app.auth.register.header.title"
          subtitle="app.auth.register.header.subtitle"
        />

        <PrefabInput
          label="app.auth.register.inputs.name.label"
          value={form.user_name}
          onChangeText={updateField('user_name')}
          disabled={isPending}
        />

        <PrefabInput
          label="app.auth.register.inputs.lastname.label"
          value={form.user_lastname}
          onChangeText={updateField('user_lastname')}
          disabled={isPending}
        />

        <PrefabInput
          label="app.auth.register.inputs.email.label"
          value={form.user_email}
          onChangeText={updateField('user_email')}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={isPending}
        />

        <PrefabInput
          label="app.auth.register.inputs.phone.label"
          value={form.user_phone}
          onChangeText={updateField('user_phone')}
          disabled={isPending}
        />

        <PrefabInput
          label="app.auth.register.inputs.password.label"
          value={form.user_password}
          onChangeText={updateField('user_password')}
          secureTextEntry
          disabled={isPending}
        />

        <PrefabInput
          label="app.auth.register.inputs.confirmPassword.label"
          value={form.confirm_password}
          onChangeText={updateField('confirm_password')}
          secureTextEntry
          disabled={isPending}
        />

        <PrefabAlert
          variant="error"
          message={localError ?? errorMessage}
          onClear={() => {
            clearError();
            onClearError();
          }}
        />

        <PrefabButton
          title="app.auth.register.submitButton"
          onPress={submit}
          isLoading={isPending}
        />

        <PrefabSeparator />

        <PrefabLink
          text="app.auth.register.footer.login"
          onPress={() => router.push('/(public)/(auth)/login')}
        />

    </View>
  );
};
