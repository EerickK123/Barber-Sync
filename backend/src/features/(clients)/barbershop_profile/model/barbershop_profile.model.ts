import { Op } from "sequelize";
import {
  Barbershop,
  Schedule,
  ServiceByBarbershop,
  Employee,
  User,
  ServiceByEmployee,
  Reservation,
  Status,
  BarbershopGallery,
} from "../../../../global/db/model";
import { IBarbershopFullResponse } from "../types/barbershop_profile.types";

export const getFullBarbershopDataByCode = async (
  code: string,
  dateStart?: string,
  dateEnd?: string,
): Promise<IBarbershopFullResponse | null> => {
  const barbershopData = await Barbershop.findOne({
    where: {
      barbershop_code: code,
      barbershop_is_active: 1,
    },
    include: [
      {
        model: Schedule,
        as: "Schedules",
        required: false,
        attributes: [
          "schedule_day_of_week",
          "schedule_open_time",
          "schedule_close_time",
        ],
      },
      {
        model: BarbershopGallery,
        as: "Gallery",
        required: false,
        attributes: ["gallery_id", "gallery_url"],
      },
      {
        model: ServiceByBarbershop,
        as: "BarbershopServices",
        required: false,
        attributes: [
          "sxb_id",
          "sxb_service_name",
          "sxb_service_duration",
          "sxb_price",
        ],
      },
      {
        model: Employee,
        as: "Employees",
        required: false,
        attributes: ["employee_id", "employee_is_active"],
        where: {
          employee_is_active: 1,
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["uuid", "user_name", "user_lastname", "user_avatar"],
          },
          {
            model: ServiceByEmployee,
            as: "EmployeeServices",
            required: false,
            attributes: ["sxe_id"],
            include: [
              {
                model: ServiceByBarbershop,
                as: "ServiceDetails",

                attributes: [
                  "sxb_id",
                  "sxb_service_name",
                  "sxb_service_duration",
                  "sxb_price",
                ],
              },
            ],
          },
          {
            model: Reservation,
            as: "Reservations",
            required: false,
            attributes: [
              "reservation_id",
              "reservation_service",
              "reservation_datetime",
              "reservation_start_slot",
              "reservation_occupied_slots",
            ],
            where: {
              reservation_status: 1,
              reservation_datetime: {
                [Op.between]: [`${dateStart} 00:00:00`, `${dateEnd} 23:59:59`],
              },
            },
            include: [
              {
                model: User,
                as: "Client",
                attributes: ["uuid"],
              },
              {
                model: Status,
                as: "Status",
                attributes: ["status", "status_id"],
              },
              {
                model: ServiceByBarbershop,
                as: "ServiceDetails",
               
                attributes: [
                  "sxb_id",
                  "sxb_service_name",
                  "sxb_service_duration",
                  "sxb_price",
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  return barbershopData as unknown as IBarbershopFullResponse | null;
};
