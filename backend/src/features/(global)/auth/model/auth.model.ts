import { User } from "../../../../global/db/model";

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({
    where: { user_email: email },
  });

  return user;
};
