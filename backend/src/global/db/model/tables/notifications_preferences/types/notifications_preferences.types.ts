export interface NotificationPreferenceAttributes {
  np_id?: number;
  np_user: string;
  np_push: boolean;
  np_email: boolean;
  np_sms: boolean;
  np_whatsapp: boolean;
  np_created_at?: Date;
  np_updated_at?: Date;
}