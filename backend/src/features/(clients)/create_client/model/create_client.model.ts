import { Client } from "../../../../global/db/model";

export const insertClient = async (userUuid: string) => {
  return await Client.create({
    client_user: userUuid,
  });
};