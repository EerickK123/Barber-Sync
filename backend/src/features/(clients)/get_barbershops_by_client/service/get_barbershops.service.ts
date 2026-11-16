import { getBarbershopsByClient } from "../model/get_barbershops.model";

export const getBarbershopsService = async (uuid: string) => {
  return await getBarbershopsByClient(uuid);
};