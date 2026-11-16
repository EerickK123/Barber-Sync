export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message: string;
}

export interface AuthUser {
  uuid: string;
  role: number;
  user_name: string;
  user_lastname: string;
  iat: number;
  exp: number;
}



