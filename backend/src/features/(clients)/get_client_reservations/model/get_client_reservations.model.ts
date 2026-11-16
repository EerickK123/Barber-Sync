import { Op } from "sequelize";
import {
  Reservation,
  Barbershop,
  ServiceByBarbershop,
  Employee,
  User,
  Status,
} from "../../../../global/db/model";

export const getReservationsByClientModel = async (
  clientUuid: string,
  targetStatuses: number[],
  limit: number,
  offset: number,
  orderDirection: "ASC" | "DESC",
) => {
  return await Reservation.findAndCountAll({
    where: {
      reservation_client: clientUuid,
      reservation_status: { [Op.in]: targetStatuses },
    },
    limit,
    offset,
    attributes: ["reservation_id", "reservation_datetime"],
    order: [["reservation_datetime", orderDirection]],
    include: [
      {
        model: Status,
        as: "Status",
        attributes: ["status_id", "status"],
      },
      {
        model: Barbershop,
        as: "Barbershop",
        attributes: [
          "barbershop_id",
          "barbershop_name",
          "barbershop_address",
          "barbershop_profile_url",
        ],
      },
      {
        model: ServiceByBarbershop,
        as: "ServiceDetails",
        attributes: ["sxb_id", "sxb_service_name", "sxb_price"],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["employee_id"],
        include: [
          {
            model: User,
            as: "User",
            attributes: ["uuid", "user_name", "user_lastname", "user_avatar"],
          },
        ],
      },
    ],
  });
};