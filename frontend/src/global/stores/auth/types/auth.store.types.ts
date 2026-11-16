import { AuthUser } from "../../../types/global.types";

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (accessToken: string, refreshToken?: string, user?: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  initializeSession: () => Promise<boolean>;
}

export interface refreshResponseData {
  tokens: {
    access_token: string;
    refresh_token: string;
  }
}