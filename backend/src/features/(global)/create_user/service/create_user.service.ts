import { createUserDTO } from "../types/create_user.types";
import { v4 as uuidv4 } from "uuid";
import { findOrCreateUser } from "../model/create_user.model";
import { throwErrorHelper } from "../../../../global/helpers";
import { UserRole } from "../../../../global/types/global-types";
import bcrypt from "bcrypt";

export const createUserService = async (
  userData: createUserDTO,
  file?: Express.Multer.File,
) => {
  // Si el servicio padre ya generó un UUID, lo usamos; de lo contrario, creamos uno nuevo
  const user_uuid = userData.uuid || uuidv4();

  const passwordHashed = await bcrypt.hash(userData.user_password, 12);
  const avatarUrl = buildAvatarUrl(file);

  const data = {
    uuid: user_uuid,
    user_role: userData.user_role as UserRole,
    user_name: userData.user_name,
    user_lastname: userData.user_lastname,
    user_email: userData.user_email,
    user_phone: userData.user_phone,
    user_password: passwordHashed,
    user_avatar: avatarUrl,
  };

  const [user, created] = await findOrCreateUser(data);

  if (!created) {
    throwErrorHelper("ERROR.CREATE_USER.EMAIL_ALREADY_EXISTS", 400);
  }

  return user;
};


const buildAvatarUrl = (file?: Express.Multer.File): string | null => {
  if (!file) return null;
  if (file.path) return file.path;
  return null;
};