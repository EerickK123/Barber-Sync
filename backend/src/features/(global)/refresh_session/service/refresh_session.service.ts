import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Dayjs from "../../../../global/lib/dayjs";
import { throwErrorHelper } from "../../../../global/helpers";
import { RefreshSessionResponse } from "../types/refresh_session.types";
import {
  findActiveTokensByDevice,
  findUserForToken,
  updateTokenById,
  upsertRefreshToken,
} from "../model/refresh_session.model";

// ── Helpers exportados para reusar en auth.service al hacer login ─────────────

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 12);
};

export const saveRefreshToken = async (
  userUuid: string,
  device: string,
  plainToken: string,
): Promise<void> => {
  const tokenHash = await hashRefreshToken(plainToken);
  const expiresAtStr = Dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");

  await upsertRefreshToken(userUuid, device, tokenHash, expiresAtStr);
};


export const refreshSessionService = async (
  incomingRefreshToken: string,
  device: string,
): Promise<RefreshSessionResponse> => {
  const currentDatetimeStr = Dayjs().format("YYYY-MM-DD HH:mm");

  const activeTokens = await findActiveTokensByDevice(
    device,
    currentDatetimeStr,
  );

  let matchedToken = null;
  for (const row of activeTokens) {
    const isMatch = await bcrypt.compare(incomingRefreshToken, row.rt_token);
    if (isMatch) {
      matchedToken = row;
      break;
    }
  }

  if (!matchedToken) {
    throwErrorHelper("ERROR.REFRESH.INVALID_OR_EXPIRED_TOKEN", 401);
  }

  const userUuid = matchedToken!.rt_user;
  const user = await findUserForToken(userUuid);

  if (!user) {
    throwErrorHelper("ERROR.REFRESH.USER_NOT_FOUND", 404);
  }


  const newRefreshToken = generateRefreshToken();
  const newTokenHash = await hashRefreshToken(newRefreshToken);
  const newExpiresAtStr = Dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");

  await updateTokenById(matchedToken!.rt_id, newTokenHash, newExpiresAtStr);

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throwErrorHelper("ERROR.SERVER.ENV_MISSING", 500);
  }

  const newAccessToken = jwt.sign(
    {
      uuid: user!.uuid,
      user_role: user!.user_role,
      user_name: user!.user_name,
      user_lastname: user!.user_lastname,
    },
    secretKey!,
    { expiresIn: "1h" },
  );

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  };
};
