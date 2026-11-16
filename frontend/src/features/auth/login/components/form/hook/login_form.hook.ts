import { useState } from 'react';

import { z } from 'zod';

import { LoginPayload } from '../../../types/login.types';

const loginSchema = z.object({
  email: z.email({
    message:
      'app.errors.INVALID_EMAIL',
  }),

  password: z
    .string()
    .min(6, {
      message:
        'app.errors.PASSWORD_SHORT',
    }),
});

export const useLoginForm = (
  onSubmit: (
    payload: LoginPayload
  ) => void
) => {
  const [form, setForm] =
    useState<LoginPayload>({
      email: '',
      password: '',
    });

  const [
    localErrorKey,
    setLocalErrorKey,
  ] = useState<
    string | undefined
  >(undefined);

  const handleInputChange =
    (
      field: keyof LoginPayload
    ) =>
    (value: string) => {
      const cleanValue =
        field === 'email'
          ? value.trim()
          : value;

      setForm((prev) => ({
        ...prev,
        [field]:
          cleanValue,
      }));

      if (localErrorKey) {
        setLocalErrorKey(
          undefined
        );
      }
    };

  const handleFormSubmit =
    () => {
      const result =
        loginSchema.safeParse(
          form
        );

      if (!result.success) {
        const firstError =
          result.error.issues[0]
            ?.message;

        setLocalErrorKey(
          firstError
        );

        return;
      }

      onSubmit(result.data);
    };

  const resetLocalError =
    () => {
      setLocalErrorKey(
        undefined
      );
    };

  return {
    form,
    localErrorKey,
    handleInputChange,
    handleFormSubmit,
    resetLocalError,
  };
};