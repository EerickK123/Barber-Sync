import { Op } from "sequelize";
import { RefreshToken, User } from "../../../../global/db/model";
import { IRefreshTokenData, IUserDataForToken } from "../types/refresh_session.types";

export const findActiveTokensByDevice = async (device: string, currentDatetimeStr: string): Promise<IRefreshTokenData[]> => {
  return await RefreshToken.findAll({
    where: {
      rt_device: device,
      // La comparación de strings en formato YYYY-MM-DD HH:mm funciona perfectamente en MySQL
      rt_expires_at: { [Op.gt]: currentDatetimeStr },
    },
    raw: true, // Crucial para retornar POJOs y no instancias de Sequelize
  }) as unknown as IRefreshTokenData[];
};

export const findUserForToken = async (uuid: string): Promise<IUserDataForToken | null> => {
  return await User.findOne({
    where: { uuid },
    attributes: ["uuid", "user_role", "user_name", "user_lastname"],
    raw: true,
  }) as unknown as IUserDataForToken | null;
};

export const updateTokenById = async (tokenId: number, newTokenHash: string, newExpiresAtStr: string) => {
  return await RefreshToken.update(
    {
      rt_token: newTokenHash,
      rt_expires_at: newExpiresAtStr,
    },
    { where: { rt_id: tokenId } }
  );
};

export const upsertRefreshToken = async (
  userUuid: string,
  device: string,
  tokenHash: string,
  expiresAtStr: string,
) => {
  const existing = await RefreshToken.findOne({
    where: { rt_user: userUuid, rt_device: device },
  });

  if (existing) {
    return await existing.update({
      rt_token: tokenHash,
      rt_expires_at: expiresAtStr,
    });
  }

  return await RefreshToken.create({
    rt_user: userUuid,
    rt_token: tokenHash,
    rt_device: device,
    rt_expires_at: expiresAtStr,
  });
};