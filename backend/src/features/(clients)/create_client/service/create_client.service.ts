import {
  createUserDTO,
  createUserService,
} from "../../../(global)/create_user";
import { authService } from "../../../(global)/auth/service/auth.service";
import { authDTO } from "../../../(global)/auth/types/auth.types";
import { throwErrorHelper } from "../../../../global/helpers";
import { AppOrigin } from "../../../../global/types/global-types";
import { insertClient } from "../model/create_client.model";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../../../../global/types/global-types";
export const createClientService = async (
  createClientData: createUserDTO,
  origin: AppOrigin,
  device: string,
  file?: Express.Multer.File,
) => {
  const { user_email, user_password, user_lastname, user_name, user_phone } =
    createClientData;

  const insertData = {
    uuid: uuidv4(),
    user_role: UserRole.client,
    user_email,
    user_password,
    user_lastname,
    user_name,
    user_phone,
  } as createUserDTO;

  const newUser = await createUserService(insertData, file);
  const userUuid = newUser.getDataValue("uuid");

  if (!userUuid) {
    throwErrorHelper("ERROR.CLIENT.USER_UUID_NOT_FOUND", 500);
  }

  await insertClient(userUuid);

  const credentials: authDTO = {
    email: createClientData.user_email,
    password: createClientData.user_password,
  };

  return await authService(credentials, origin, device);
};
