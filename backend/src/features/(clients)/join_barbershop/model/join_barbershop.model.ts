import { Barbershop, BarbershopByClient } from "../../../../global/db/model";
import { joinClientToBarbershopByCodeDTO } from "../types/join_barbershop.types";

export const joinClientToBarbershopByCode = async ({
  barbershop_code,
  uuid,
}: joinClientToBarbershopByCodeDTO): Promise<boolean | null> => {
  const barbershop = await Barbershop.findOne({
    where: { barbershop_code },
    attributes: ["barbershop_id"],
  });

  if (!barbershop) {
    return null;
  }

  const barbershopId = barbershop.get("barbershop_id") as number;

  const [_, created] = await BarbershopByClient.findOrCreate({
    where: {
      bxc_barbershop: barbershopId,
      bxc_client: uuid,
    },
    defaults: {
      bxc_barbershop: barbershopId,
      bxc_client: uuid,
    },
  });

  return created;
};