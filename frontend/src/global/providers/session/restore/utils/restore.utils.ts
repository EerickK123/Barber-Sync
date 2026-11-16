import * as SecureStore from 'expo-secure-store';

import { jwtDecode } from 'jwt-decode';

import { AuthUser } from '@/global/types/global.types';

import { RestoreSessionResponse } from '../types/restore.types';

export const restoreSession =
  async (): Promise<RestoreSessionResponse | null> => {
    const accessToken =
      await SecureStore.getItemAsync(
        'accessToken'
      );

    if (!accessToken) {
      return null;
    }

    try {
      const decoded =
        getDecodedUser(accessToken);

      if (isTokenExpired(decoded.exp)) {
        await SecureStore.deleteItemAsync(
          'accessToken'
        );

        return null;
      }

      return {
        accessToken,
        user: decoded,
      };
    } catch {
      await SecureStore.deleteItemAsync(
        'accessToken'
      );

      return null;
    }
  };

const isTokenExpired = (
  exp: number
) => {
  const currentTime =
    Date.now() / 1000;

  return exp < currentTime;
};

const getDecodedUser = (
  token: string
) => {
  return jwtDecode<AuthUser>(token);
};