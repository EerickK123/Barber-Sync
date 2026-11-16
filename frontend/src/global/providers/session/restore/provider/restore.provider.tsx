import React, {
  createContext,
  useEffect,
  useState,
} from 'react';

import {
  View,
  ActivityIndicator,
} from 'react-native';

import { restoreSession } from '../utils/restore.utils';

import { useAuthStore } from '@/global/stores';

import {
  RestoreContextProps,
  RestoreProviderProps,
} from '../types/restore.types';

import { AuthUser } from '@/global/types/global.types';

export const RestoreContext =
  createContext<RestoreContextProps>({
    isRestoring: true,
  });

export const RestoreProvider = ({
  children,
}: RestoreProviderProps) => {
  const { isRestoring } =
    useRestoreSession();

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RestoreContext.Provider
      value={{
        isRestoring,
      }}>
      {children}
    </RestoreContext.Provider>
  );
};

const initializeSession = async (
  setSession: (
    token: string,
    user: AuthUser
  ) => void,

  setIsRestoring: (
    value: boolean
  ) => void
) => {
  try {
    const session =
      await restoreSession();

    if (session) {
      setSession(
        session.accessToken,
        session.user
      );
    }
  } catch (error) {
    console.log(
      'Restore Session Error:',
      error
    );
  } finally {
    setIsRestoring(false);
  }
};

const useRestoreSession = () => {
  const setSession =
    useAuthStore(
      (state) => state.setSession
    );

  const [isRestoring, setIsRestoring] =
    useState(true);

  useEffect(() => {
    initializeSession(
      setSession,
      setIsRestoring
    );
  }, [setSession]);

  return {
    isRestoring,
  };
};