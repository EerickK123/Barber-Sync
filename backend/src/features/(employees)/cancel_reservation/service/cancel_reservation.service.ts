import Dayjs from "../../../../global/lib/dayjs";
import {
  findEmployeeByUserUuid,
  getReservationByIdAndEmployee,
  updateReservationToCanceled,
} from "../model/cancel_reservation.model";
import { throwErrorHelper } from "../../../../global/helpers";

const CANCELLATION_LIMIT_MINUTES = 30;

export const cancelEmployeeReservationService = async (
  employee_uuid: string,
  reservation_id: number,
) => {
  const employee = await findEmployeeByUserUuid(employee_uuid);
  if (!employee) throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND", 404);

  const employeeId = employee!.dataValues.employee_id!;

  const reservation = await getReservationByIdAndEmployee(
    reservation_id,
    employeeId,
  );
  if (!reservation)
    throwErrorHelper("ERROR.RESERVATION.NOT_FOUND_OR_NOT_PENDING", 404);

  const now = Dayjs.tz();
  const reservationTime = Dayjs.utc(
    reservation!.dataValues.reservation_datetime,
  ).tz();

  const minutesDifference = reservationTime.diff(now, "minutes");

  if (minutesDifference < CANCELLATION_LIMIT_MINUTES) {
    throwErrorHelper("ERROR.RESERVATION.CANCELLATION_TIME_EXPIRED", 403);
  }

  await updateReservationToCanceled(reservation_id);

  return true;
};
