import { NotificationToken } from "../../../../global/db/model";
import { DeviceType } from "../types/register_push_token.types";

export const upsertPushToken = async (
  user_uuid: string,
  token: string,
  deviceType: DeviceType
) => {
  return await NotificationToken.upsert({
    nt_user: user_uuid,
    nt_token: token,
    nt_device_type: deviceType,
  } as any);
};