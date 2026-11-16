import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import { useAuthStore } from '@/global/stores';
import { AuthUser } from '@/global/types/global.types';
import { RegisterFormState, RegisterResponseData } from '../types/register.types';
import { registerRequest } from '../service/register.service';
export const useRegister = () => {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation<RegisterResponseData, Error, RegisterFormState>({
    mutationKey: ['register_mutation'],
    mutationFn: registerRequest,
    onSuccess: async (data) => {
      const { access_token, refresh_token } = data.tokens;
      const decoded = jwtDecode<AuthUser>(access_token);
      await setSession(access_token, refresh_token, decoded);
      router.replace('/(protected)/(tabs)/home');
    },
  });
};
