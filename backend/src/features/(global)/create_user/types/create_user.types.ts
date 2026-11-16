import { UserRole } from "../../../../global/types/global-types";

export interface createUserDTO {
  uuid?: string;
  user_role: UserRole;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_password: string;
  user_avatar?: string | null; 
}