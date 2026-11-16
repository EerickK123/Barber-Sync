import { User } from "../../../../global/db/model";

// Nueva función para obtener al usuario
export const findUserByUuidModel = async (uuid: string) => {
  return await User.findOne({
    where: {
      uuid: uuid,
    },
  });
};

export const updateClientProfileModel = async (
  uuid: string,
  fieldsToUpdate: Record<string, any>,
): Promise<boolean> => {
  const [affectedCount] = await User.update(fieldsToUpdate, {
    where: {
      uuid: uuid,
    },
  });

  return affectedCount > 0;
};