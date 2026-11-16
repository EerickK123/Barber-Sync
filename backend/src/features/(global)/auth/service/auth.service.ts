import { authDTO } from "../types/auth.types";
import { getUserByEmail } from "../model/auth.model";
import { throwErrorHelper } from "../../../../global/helpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppOrigin, UserRole } from "../../../../global/types/global-types";
import {
  generateRefreshToken,
  saveRefreshToken,
} from "../../refresh_session/service/refresh_session.service";

const ROLE_BY_ORIGIN_MAP: Record<AppOrigin, UserRole[]> = {
  [AppOrigin.ADMIN]: [UserRole.AppAdmin],
  [AppOrigin.BUSINESS]: [UserRole.BusinessAdmin, UserRole.Employee],
  [AppOrigin.CLIENT]: [UserRole.client],
};

export const authService = async (
  { email, password }: authDTO,
  origin: AppOrigin,
  device: string,
) => {
  const user = await getUserByEmail(email);
  if (!user) throwErrorHelper("ERROR.AUTH.INVALID_CREDENTIALS", 401);

  const userData = user!.dataValues;

  if (!ROLE_BY_ORIGIN_MAP[origin].includes(userData.user_role as UserRole)) {
    throwErrorHelper("ERROR.AUTH.ROLE_NOT_AUTHORIZED", 403);
  }

  const isValidPassword = await bcrypt.compare(
    password,
    userData.user_password as string,
  );

  if (!isValidPassword) throwErrorHelper("ERROR.AUTH.INVALID_CREDENTIALS", 401);

  const accessToken = generateAccessToken(
    userData.uuid,
    userData.user_role as UserRole,
    userData.user_name,
    userData.user_lastname,
  );
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(userData.uuid, device, refreshToken);
  return { access_token: accessToken, refresh_token: refreshToken };
};

const generateAccessToken = (
  uuid: string,
  role: UserRole,
  user_name: string,
  user_lastname: string,
) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) throwErrorHelper("ERROR.LOGIN.SERVER_ENV_MISSING", 500);

  return jwt.sign(
    { uuid, user_role: role, user_name, user_lastname },
    secretKey as string,
    { expiresIn: "1h" },
  );
};
