export interface RefreshTokenAttributes {
  rt_id: number;
  rt_user: string;
  rt_token: string;
  rt_device: string;
  rt_expires_at: string;
  rt_created_at?: Date;
}