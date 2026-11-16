export interface NotificationTokenAttributes {
  nt_id?: number;
  nt_user: string;
  nt_token: string;
  nt_device_type: 'android' | 'ios' | 'web';
  nt_created_at?: Date;
  nt_updated_at?: Date;
}

