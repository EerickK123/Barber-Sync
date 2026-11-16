export interface IUpdateClientProfileData {
  profile_info: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  };
}