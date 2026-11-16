declare global {
  namespace Express {
    interface Request {
      appContext?: AppOrigin;
      userPayload?: {
        uuid: string;
        user_role: UserRole;
        user_name: string;
        user_lastname: string;
      };
    }
  }
}

export enum UserRole {
  BusinessAdmin = 1,
  Employee = 2,
  client = 3,
  AppAdmin = 4,
}

export enum AppOrigin {
  ADMIN = "x-admin-web",
  CLIENT = "x-client-app",
  BUSINESS = "x-business-app",
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message: string;
}

export interface tokenPayload {
  uuid: string;
  user_role: UserRole.client;
  user_name: string;
  user_lastname: string;
  iat: number;
  exp: number;
}
