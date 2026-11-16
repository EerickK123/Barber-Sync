export interface IClientProfileResponse {
  uuid: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_avatar: string | null;
  user_phone: string;
}

export interface IClientProfileOutput {
  name: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
}
