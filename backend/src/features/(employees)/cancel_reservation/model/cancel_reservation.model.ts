import { Employee, Reservation } from "../../../../global/db/model";

export const findEmployeeByUserUuid = async (employee_uuid: string) => {
  return await Employee.findOne({
    where: { employee_user: employee_uuid, employee_is_active: true },
    attributes: ["employee_id", "employee_barbershop"],
  });
};

export const getReservationByIdAndEmployee = async (
  reservation_id: number,
  employee_id: number,
) => {
  return await Reservation.findOne({
    where: {
      reservation_id: reservation_id,
      reservation_employee: employee_id,
      reservation_status: 1,
    },
    attributes: ["reservation_id", "reservation_datetime"],
  });
};

export const updateReservationToCanceled = async (reservation_id: number) => {
  return await Reservation.update(
    { reservation_status: 4 },
    { where: { reservation_id } }
  );
};