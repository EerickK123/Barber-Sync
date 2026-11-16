import { User } from "../../../../global/db/model";
import { IClientProfileResponse } from "../types/client_profile.types";

export const getClientProfileByUuidModel = async (
  uuid: string,
): Promise<IClientProfileResponse | null> => {
  const profileData = await User.findOne({
    where: {
      uuid,
    },
    attributes: [
      "uuid", 
      "user_name", 
      "user_lastname", 
      "user_email", 
      "user_avatar",
      "user_phone"
    ],
  });

  return profileData as unknown as IClientProfileResponse | null;
};