import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { loginRequest } from '../service/login.service';
import { router } from 'expo-router';
import { useAuthStore } from '@/global/stores/auth/auth.store';
import { AuthUser } from '@/global/types/global.types';
import { LoginResponseData, LoginRequestDTO } from '../types/login.types';

export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation<LoginResponseData, Error, LoginRequestDTO>({
    mutationKey: ['login_mutation'],
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      try {
        const access_token = data.tokens.access_token;
        const refresh_token = data.tokens.refresh_token;
        const decoded = jwtDecode<AuthUser>(access_token);
        await setSession(access_token as string, refresh_token as string, decoded as AuthUser);
        router.replace('/(protected)/(tabs)/home');
      } catch (decodeError) {
        console.error('[useLogin] Error procesando el token:', decodeError);
      }
    },
  });
};
