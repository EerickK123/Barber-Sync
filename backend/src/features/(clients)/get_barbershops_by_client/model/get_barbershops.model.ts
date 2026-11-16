import { Barbershop, BarbershopByClient } from "../../../../global/db/model";

export const getBarbershopsByClient = async (uuid: string) => {
  return await Barbershop.findAll({
    attributes: ["barbershop_name", "barbershop_code", "barbershop_cover_url", "barbershop_profile_url"],
    where: {
      barbershop_is_active: 1,
    },
    include: [
      {
        model: BarbershopByClient,
        as: "BarbershopClients",
        where: { bxc_client: uuid },
        attributes: [],
      },
    ],
  });
};
