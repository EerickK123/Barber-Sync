import { joinClientToBarbershopByCode } from "../model/join_barbershop.model";
import { throwErrorHelper } from "../../../../global/helpers";

export const joinBarbershopByCodeService = async (uuid: string, code: string) => {
  const result = await joinClientToBarbershopByCode({
    barbershop_code: code,
    uuid: uuid,
  });
  if (result === null) {
    throwErrorHelper("ERROR.BARBERSHOP.NOT_FOUND", 404);
  }
  if (result === false) {
    throwErrorHelper("ERROR.BARBERSHOP.ALREADY_JOINED", 409);
  }

  return result;
};