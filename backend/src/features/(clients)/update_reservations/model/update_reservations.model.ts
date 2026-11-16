import { Op, Transaction } from "sequelize";
import Dayjs from "../../../../global/lib/dayjs"; // 👈 Importamos tu configuración de Dayjs
import {
  Reservation,
  Schedule,
  ServiceByBarbershop,
  Employee,
  Barbershop,
  ServiceByEmployee,
  User,
} from "../../../../global/db/model";

export const getExistingReservationModel = async (reservationId: number, clientUuid: string) => {
  return await Reservation.findOne({
    where: { reservation_id: reservationId, reservation_client: clientUuid },
    include: [
      {
        model: Employee,
        as: "Employee",
        include: [{ model: User, as: "User", attributes: ["uuid"] }],
      },
    ],
  });
};

export const getValidationDataForUpdate = async (
  barbershopId: number,
  employeeUuid: string,
  serviceByBarbershopId: number,
  dayOfWeek: number,
  date: string, // 👈 Cambiado: Recibe un string único tipo "YYYY-MM-DD"
) => {
  // Calculamos el inicio y fin absoluto del día local transformados a UTC
  const startUtc = Dayjs.tz(`${date} 00:00:00`).utc().format();
  const endUtc = Dayjs.tz(`${date} 23:59:59`).utc().format();

  return await Promise.all([
    Reservation.findAll({
      attributes: [
        "reservation_id", 
        "reservation_employee", 
        "reservation_start_slot", 
        "reservation_occupied_slots"
      ],
      where: {
        reservation_barbershop: barbershopId,
        reservation_datetime: { [Op.between]: [startUtc, endUtc] }, // 👈 Consulta segura en UTC
        reservation_status: { [Op.in]: [1, 2] },
      },
    }),
    Schedule.findOne({
      attributes: ["schedule_open_time", "schedule_close_time"],
      where: { schedule_barbershop: barbershopId, schedule_day_of_week: dayOfWeek },
    }),
    ServiceByBarbershop.findOne({
      attributes: ["sxb_id", "sxb_service_duration"],
      where: { sxb_id: serviceByBarbershopId, sxb_barbershop: barbershopId },
    }),
    Employee.findOne({
      attributes: ["employee_id", "employee_user", "employee_barbershop"],
      where: { employee_user: employeeUuid, employee_barbershop: barbershopId },
    }),
    Barbershop.findByPk(barbershopId, { attributes: ["barbershop_id"] }),
  ]);
};

export const validateEmployeeServiceUpdate = async (employeeId: number, serviceId: number) => {
  return await ServiceByEmployee.findOne({
    attributes: ["sxe_id"],
    where: { sxe_employee: employeeId, sxe_service: serviceId },
  });
};

export const updateReservationModel = async (
  reservationId: number,
  data: any,
  transaction: Transaction,
): Promise<boolean> => {
  const [affectedCount] = await Reservation.update(data, {
    where: { reservation_id: reservationId },
    transaction,
  });
  return affectedCount > 0;
};