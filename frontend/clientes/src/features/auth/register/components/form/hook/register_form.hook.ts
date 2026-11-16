import { useState } from 'react';
import { z } from 'zod';
import { RegisterFormState } from '../../../types/register.types';
const schema = z
  .object({
    user_name: z.string().min(1),
    user_lastname: z.string().min(1),
    user_email: z.email(),
    user_phone: z.string().min(7),
    user_password: z.string().min(6),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.user_password === data.confirm_password, {
    message: 'app.errors.PASSWORDS_NOT_MATCH',
    path: ['confirm_password'],
  });

export const useRegisterForm = (onSubmit: (data: RegisterFormState) => void) => {
  const [form, setForm] = useState<RegisterFormState>({
    user_name: '',
    user_lastname: '',
    user_email: '',
    user_phone: '',
    user_password: '',
    confirm_password: '',
  });
  const [localError, setLocalError] = useState<string | undefined>();
  const updateField = (field: keyof RegisterFormState) => (value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError(undefined);
  };

  const submit = () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      setLocalError(result.error.issues[0]?.message);
      return;
    }
    onSubmit(form);
  };
  return {
    form,
    localError,
    updateField,
    submit,
    clearError: () => setLocalError(undefined),
  };
};
