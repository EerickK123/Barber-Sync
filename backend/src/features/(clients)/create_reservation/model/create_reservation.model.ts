import { Op, Transaction } from "sequelize";
import dayjs from "../../../../global/lib/dayjs";
import {
  Reservation,
  Schedule,
  ServiceByBarbershop,
  Employee,
  Barbershop,
  ServiceByEmployee,
} from "../../../../global/db/model";

export const getValidationData = async (
  barbershopId: number,
  employeeUuid: string,
  serviceByBarbershopId: number,
  dayOfWeek: number,
  date: string,
) => {
  // Calculamos el inicio y fin del día en la zona horaria local (Bogotá) y los convertimos a UTC
  const startUtc = dayjs.tz(`${date} 00:00:00`).utc().format();
  const endUtc = dayjs.tz(`${date} 23:59:59`).utc().format();

  return await Promise.all([
    Reservation.findAll({
      attributes: [
        "reservation_employee",
        "reservation_start_slot",
        "reservation_occupied_slots",
      ],
      where: {
        reservation_barbershop: barbershopId,
        reservation_datetime: {
          [Op.between]: [startUtc, endUtc], // Protegido contra el desajuste de 5 horas
        },
        reservation_status: {
          [Op.in]: [1, 2],
        },
      },
    }),

    Schedule.findOne({
      attributes: ["schedule_open_time", "schedule_close_time"],
      where: {
        schedule_barbershop: barbershopId,
        schedule_day_of_week: dayOfWeek,
      },
    }),

    ServiceByBarbershop.findOne({
      attributes: ["sxb_id", "sxb_service_duration"],
      where: {
        sxb_id: serviceByBarbershopId,
        sxb_barbershop: barbershopId,
      },
    }),

    Employee.findOne({
      attributes: ["employee_id", "employee_user", "employee_barbershop"],
      where: {
        employee_user: employeeUuid,
        employee_barbershop: barbershopId,
      },
    }),

    Barbershop.findByPk(barbershopId, {
      attributes: ["barbershop_id"],
    }),
  ]);
};

export const validateEmployeeService = async (
  employeeId: number,
  serviceId: number,
) => {
  return await ServiceByEmployee.findOne({
    attributes: ["sxe_id"],
    where: {
      sxe_employee: employeeId,
      sxe_service: serviceId,
    },
  });
};

export const createReservation = async (
  data: any,
  transaction: Transaction,
): Promise<boolean> => {
  const newReservation = await Reservation.create(
    {
      reservation_client: data.reservation_client,
      reservation_employee: data.reservation_employee,
      reservation_service: data.reservation_service,
      reservation_barbershop: data.reservation_barbershop,
      reservation_datetime: data.reservation_datetime,
      reservation_start_slot: data.reservation_start_slot,
      reservation_occupied_slots: data.reservation_occupied_slots,
      reservation_status: 1,
    },
    {
      transaction,
    },
  );

  return !!newReservation;
};