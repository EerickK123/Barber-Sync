import { throwErrorHelper } from "../../../../global/helpers";
import { getClientProfileByUuidModel } from "../model/client_profile.model";
import { IClientProfileOutput } from "../types/client_profile.types";

export const getClientProfileService = async (
  uuid: string,
): Promise<IClientProfileOutput> => {
  const profile = await getClientProfileByUuidModel(uuid);

  if (!profile) {
    throwErrorHelper("ERROR.CLIENT.PROFILE_NOT_FOUND", 404);
  }

  return {
    name: profile!.user_name,
    lastName: profile!.user_lastname,
    email: profile!.user_email,
    avatar: profile!.user_avatar ?? null,
    phone: profile!.user_phone, 
  };
};