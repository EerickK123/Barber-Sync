export interface RefreshSessionDTO {
  refresh_token: string;
}

export interface RefreshSessionResponse {
  access_token: string;
  refresh_token: string;
}

// Interfaces internas para desacoplar el ORM del servicio
export interface IRefreshTokenData {
  rt_id: number;
  rt_user: string;
  rt_token: string;
  rt_device: string;
  rt_expires_at: string;
}

export interface IUserDataForToken {
  uuid: string;
  user_role: number;
  user_name: string;
  user_lastname: string;
}