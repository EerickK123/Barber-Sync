import React from 'react';

import { View } from 'react-native';

import { useRegister } from '../hook/register.hook';

import { RegisterFormComponent } from '../components/form/register_form.component';

export const RegisterScreen = () => {
  const { mutate, error, isPending, reset } = useRegister();

  return (
    <View className="flex-1">
      <RegisterFormComponent
        onSubmit={mutate}
        isPending={isPending}
        errorMessage={error?.message}
        onClearError={reset}
      />
    </View>
  );
};
