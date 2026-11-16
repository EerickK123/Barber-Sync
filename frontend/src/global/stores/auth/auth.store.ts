import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { AuthState, refreshResponseData } from './types/auth.store.types';
import { queryClient } from '../../providers/query';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@/global/api/interceptor/types/api.interceptor.types';
import { API_ROUTES, publicApi } from '@/global/api';
import { ApiResponse } from '../../types/global.types';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setSession: async (accessToken, refreshToken, user) => {
    try {
      await persistTokensInStorage(accessToken, refreshToken!);
      set((state) => ({
        accessToken,
        user: user !== undefined ? user : state.user,
      }));
    } catch (error) {
      console.error('[AUTH STORE ERROR] Falló la persistencia de tokens:', error);
    }
  },

  initializeSession: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) return false;

      if (isTokenValidAndFresh(token)) {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        set({ accessToken: token, user: decoded as any });
        return true;
      }

      const { tokens } = await requestTokenRefresh();
      const access_token = tokens.access_token;
      const refresh_token = tokens.refresh_token;
      const decodedNewToken = jwtDecode<any>(access_token);
      console.log(access_token, refresh_token);
      await persistTokensInStorage(access_token, refresh_token);

      set({ accessToken: access_token, user: decodedNewToken });
      return true;
    } catch (error) {
      await useAuthStore.getState().logout();
      return false;
    }
  },

  logout: async () => {
    try {
      await clearTokensFromStorage();
    } catch (error) {
      console.warn('[AUTH STORE] Error limpiando almacenamiento físico en logout:', error);
    } finally {
      queryClient.clear();
      set({
        accessToken: null,
        user: null,
      });
    }
  },
}));

const persistTokensInStorage = async (
  accessToken: string,
  refreshToken?: string
): Promise<void> => {
  await SecureStore.setItemAsync('accessToken', accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
};

const clearTokensFromStorage = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};

const isTokenValidAndFresh = (token: string): boolean => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const expiryTimeMs = decoded.exp * 1000;
    const currentTimeMs = Date.now();
    const FIVE_MINUTES = 300000;

    return expiryTimeMs - currentTimeMs > FIVE_MINUTES;
  } catch {
    return false;
  }
};

const requestTokenRefresh = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) throw new Error('No refresh token found in storage');

  const response = await publicApi.post<ApiResponse<refreshResponseData>>(
    API_ROUTES.PUBLIC.REFRESH,
    {
      refresh_token: refreshToken,
    }
  );

  return response.data.result;
};
