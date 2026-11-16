import { User } from "../../../../global/db/model";
import { createUserDTO } from "../types/create_user.types";

export const findOrCreateUser = async (data: createUserDTO & { uuid: string }) => {
  return await User.findOrCreate({
    where: { user_email: data.user_email },
    defaults: data,
  });
};