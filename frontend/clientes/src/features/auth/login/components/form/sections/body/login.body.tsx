import React from 'react';
import { View, Text } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/global/providers/theme';
import { PrefabAlert, PrefabButton, PrefabInput, PrefabLink } from '@/global/components';
import {
  RenderFormActionsProps,
  RenderFormFieldsProps,
  LoginFormProps,
} from '../../../../types/login.types';
import { useLoginForm } from '../../hook/login_form.hook';

export const LoginBody = ({ onSubmit, isPending, errorMessage, onClearError }: LoginFormProps) => {
  const { t } = useTranslation();
  const { form, localErrorKey, handleInputChange, handleFormSubmit, resetLocalError } =
    useLoginForm(onSubmit);

  const activeError = localErrorKey
    ? t(localErrorKey)
    : errorMessage
      ? t(`server.${errorMessage}`)
      : undefined;

  const handleClearAllErrors = () => {
    if (localErrorKey) resetLocalError();
    if (errorMessage) onClearError();
  };

  return (
    <View className="mt-4 w-full items-stretch gap-5" style={{ overflow: 'visible' }}>
      <RenderInnerHeader />
      <RenderFormFields form={form} isPending={isPending} onInputChange={handleInputChange} />
      <RenderFormActions
        isPending={isPending}
        errorMessage={activeError}
        onFormSubmit={handleFormSubmit}
        onClearError={handleClearAllErrors}
      />
    </View>
  );
};

const RenderInnerHeader = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View className="mb-2 w-full flex-row items-center justify-center gap-3 px-1">
      <Text className="text-4xl font-black tracking-tight" style={{ color: theme.textPrimary }}>
        {t('app.auth.login.form.body.login')}
      </Text>
      <Feather name="log-in" size={26} color={theme.accent} />
    </View>
  );
};

const RenderFormFields = ({ form, isPending, onInputChange }: RenderFormFieldsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const forgotPasswordRouter = () => router.push('/(public)/(auth)/forgot-password');

  return (
    <>
      <PrefabInput
        label={t('app.auth.login.form.body.inputs.email.label')}
        placeholder={t('app.auth.login.form.body.inputs.email.placeholder')}
        value={form.email}
        onChangeText={onInputChange('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        disabled={isPending}
      />

      <PrefabInput
        label={t('app.auth.login.form.body.inputs.password.label')}
        placeholder={t('app.auth.login.form.body.inputs.password.placeholder')}
        value={form.password}
        onChangeText={onInputChange('password')}
        secureTextEntry
        disabled={isPending}
      />

      <PrefabLink
        text={t('app.auth.login.form.body.forgotPassword')}
        onPress={forgotPasswordRouter}
        color={theme.accent}
        classNameText="text-sm font-semibold"
        style={{ marginTop: 4, alignSelf: 'flex-end', paddingRight: 4 }}
      />
    </>
  );
};

const RenderFormActions = ({
  isPending,
  errorMessage,
  onFormSubmit,
  onClearError,
}: RenderFormActionsProps) => {
  const { t } = useTranslation();

  return (
    <View className="mt-2 w-full gap-4" style={{ overflow: 'visible' }}>
      <PrefabButton
        title={t('app.auth.login.form.body.submitButton')}
        isLoading={isPending}
        onPress={onFormSubmit}
        variant="primary"
      />
      <PrefabAlert message={errorMessage} onClear={onClearError} variant="error" />
    </View>
  );
};
