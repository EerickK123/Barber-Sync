import React from 'react';

import { View } from 'react-native';

import { router } from 'expo-router';

import { PrefabAlert } from '@/global/components/alert/alert.component';
import { PrefabButton } from '@/global/components/button/button.component';
import { PrefabCard } from '@/global/components/card/card.component';
import { PrefabHeader } from '@/global/components/header/header.component';
import { PrefabInput } from '@/global/components/input/input_field.component';
import { PrefabLink } from '@/global/components/link/link.component';
import { PrefabSeparator } from '@/global/components/separator/separator.component';
import { PrefabText } from '@/global/components/text/text.component';

import { useLoginForm } from './hook/login_form.hook';

import { LoginFormProps } from '../../types/login.types';

export const LoginForm = ({ onSubmit, isPending, errorMessage, onClearError }: LoginFormProps) => {
  const { form, localErrorKey, handleInputChange, handleFormSubmit, resetLocalError } =
    useLoginForm(onSubmit);

  const resolvedError = localErrorKey ?? errorMessage;

  const clearErrors = () => {
    resetLocalError();
    onClearError();
  };

  return (
    <View className="flex-1 justify-center px-6">
      <PrefabHeader title="auth.login.title" subtitle="auth.login.subtitle" />

      <PrefabInput
        label="auth.login.email"
        value={form.email}
        onChangeText={handleInputChange('email')}
        editable={!isPending}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <PrefabInput
        label="auth.login.password"
        value={form.password}
        onChangeText={handleInputChange('password')}
        editable={!isPending}
        secureTextEntry
      />

      <PrefabAlert variant="error" message={resolvedError} onClear={clearErrors} />

      <View className="mt-4">
        <PrefabButton title="auth.login.submit" onPress={handleFormSubmit} isLoading={isPending} />
      </View>

      <View className="items-center">
        <PrefabLink
          text="auth.login.forgot_password"
          onPress={() => {
            router.push('/(public)/(auth)/recover');
          }}
        />
      </View>

      <PrefabSeparator />

      <View className="items-center gap-2">
        <PrefabText variant="caption">{"auth.login.no_account"}</PrefabText>

        <PrefabLink
          text="auth.login.create_account"
          onPress={() => {
            router.push('/(public)/(auth)/register');
          }}
        />
      </View>
    </View>
  );
};
