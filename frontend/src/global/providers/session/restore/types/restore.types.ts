import { AuthUser } from '../../../../types/global.types';

export interface RestoreSessionResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RestoreProviderProps {
  children: React.ReactNode;
}

export interface RestoreContextProps {
  isRestoring: boolean;
}
