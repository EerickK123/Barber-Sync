import { upsertPushToken } from "../model/register_push_token.model";
import { DeviceType } from "../types/register_push_token.types";

export const registerPushTokenService = async (
  user_uuid: string,
  token: string,
  deviceType: DeviceType,
) => {
  return await upsertPushToken(user_uuid, token, deviceType);
};
