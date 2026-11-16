import * as SecureStore from 'expo-secure-store';
import { InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { privateApi, publicApi } from '../';
import { API_ROUTES } from '../config/api.config';
import { useAuthStore } from '../../stores';
import { CustomJwtPayload, refreshPromiseType } from './types/api.interceptor.types';

let refreshPromise: refreshPromiseType = null;

const getOrInitializeToken = async (): Promise<string | null> => {
  let token = useAuthStore.getState().accessToken;
  if (!token) {
    token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      await useAuthStore.getState().setSession(token);
    }
  }
  return token;
};

const isTokenNearExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const expiryTimeMs = decoded.exp * 1000;
    const currentTimeMs = Date.now();
    const FIVE_MINUTES = 300000;

    return expiryTimeMs - currentTimeMs <= FIVE_MINUTES;
  } catch (error) {
    console.warn('[AUTH INTERCEPTOR] Error al decodificar JWT:', error);
    return false;
  }
};

const executeTokenRefresh = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found in storage');

    const response = await publicApi.post(API_ROUTES.PUBLIC.REFRESH, {
      refresh_token: refreshToken,
    });

    const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data.result.tokens;
    await useAuthStore.getState().setSession(newAccessToken, newRefreshToken);

    return newAccessToken;
  } catch (refreshError) {
    console.error(
      '[AUTH INTERCEPTOR CRITICAL] Error en renovación. Forzando logout:',
      refreshError
    );
    await useAuthStore.getState().logout();
    return null;
  } finally {
    refreshPromise = null;
  }
};

privateApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = await getOrInitializeToken();
    if (!token) return config;
    if (isTokenNearExpiry(token)) {
      if (!refreshPromise) {
        refreshPromise = executeTokenRefresh();
      }
      const renewedToken = await refreshPromise;
      if (!renewedToken) {
        return Promise.reject(new Error('SESSION_EXPIRED_FORCED_LOGOUT'));
      }
      token = renewedToken;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
