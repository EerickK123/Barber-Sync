import { Op } from "sequelize";
import {
  Employee,
  Reservation,
  User,
  ServiceByBarbershop,
} from "../../../../global/db/model";
import { FindAgendaParams } from "../types/get_employee_schedule.types";

export const findEmployeeByUserUuid = async (employee_uuid: string) => {
  return await Employee.findOne({
    where: { employee_user: employee_uuid, employee_is_active: true },
    attributes: ["employee_id", "employee_barbershop"],
  });
};

export const findEmployeeAgenda = async ({
  employee_id,
  status_id,
  startDateTime,
  endDateTime,
  page,
  limit,
}: FindAgendaParams) => {
  const offset = (page - 1) * limit;

  return await Reservation.findAndCountAll({
    where: {
      reservation_employee: employee_id,
      reservation_status: status_id,
      reservation_datetime: {
        [Op.between]: [startDateTime, endDateTime],
      },
    },
    attributes: [
      "reservation_id",
      "reservation_datetime",
      "reservation_start_slot",
      "reservation_occupied_slots",
      "reservation_status",
    ],
    include: [
      {
        model: User,
        as: "client",
        attributes: [
          "uuid",
          "user_name",
          "user_lastname",
          "user_phone",
          "user_avatar",
        ],
      },
      {
        model: ServiceByBarbershop,
        as: "service",
        attributes: [
          "sxb_id",
          "sxb_service_name",
          "sxb_service_duration",
          "sxb_price",
        ],
      },
    ],
    order: [["reservation_datetime", "ASC"]],
    limit,
    offset,
  });
};
