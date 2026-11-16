
export interface UserAttributes {
  uuid: string;
  user_role: number;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_password: string;
  user_avatar?: string | null;
}