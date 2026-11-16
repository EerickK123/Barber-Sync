import Dayjs from "../../../../global/lib/dayjs";
import { db_pool } from "../../../../global/db/config/db-config";
import { throwErrorHelper } from "../../../../global/helpers";
import {
  getValidationData,
  validateEmployeeService,
  createReservation,
} from "../model/create_reservation.model";
import { ICreateReservationData } from "../types/create_reservation.types";

export const createReservationService = async (
  data: ICreateReservationData,
  clientUuid: string,
) => {
  const reservationDate = parseReservationDate(data.reservation_datetime);
  validateReservationInput(reservationDate);

  const { date, dayOfWeek } = getReservationWindow(reservationDate);
  const validationData = await getValidationData(
    data.reservation_barbershop,
    data.reservation_employee,
    data.reservation_service,
    dayOfWeek,
    date, 
  );

  const {
    employee,
    targetService,
    barbershop,
    barbershopSchedule,
    existingReservations,
  } = extractValidationResults(validationData);

  validateDatabaseEntities({
    existingReservations,
    employee,
    targetService,
    barbershop,
    barbershopSchedule,
  });

  const employeeId = getEmployeeId(employee);
  const employeeService = await validateEmployeeService(
    employeeId,
    data.reservation_service,
  );

  if (!employeeService) {
    throwErrorHelper("ERROR.EMPLOYEE.SERVICE_NOT_AVAILABLE", 400);
  }

  const reservationMetrics = buildReservationMetrics(
    reservationDate,
    barbershopSchedule,
    targetService,
  );

  validateSlotBounds(
    reservationMetrics.startSlot,
    reservationMetrics.endSlot,
    reservationMetrics.totalJourneySlots,
  );

  const employeeReservations = filterEmployeeReservations(
    existingReservations,
    employeeId,
  );

  if (
    checkOverlapConflict(
      employeeReservations,
      reservationMetrics.startSlot,
      reservationMetrics.endSlot,
    )
  ) {
    throwErrorHelper("ERROR.RESERVATION.TIME_SLOT_OVERLAP", 409);
  }

  return await createReservationTransaction({
    clientUuid,
    employeeId,
    reservationData: data,
    startSlot: reservationMetrics.startSlot,
    occupiedSlots: reservationMetrics.occupiedSlots,
  });
};

const parseReservationDate = (reservation_datetime: string) =>
  Dayjs.tz(reservation_datetime, "YYYY-MM-DD HH:mm");

const getReservationWindow = (reservationDate: ReturnType<typeof Dayjs>) => ({
  date: reservationDate.format("YYYY-MM-DD"),
  dayOfWeek: reservationDate.day(),
});

const validateReservationInput = (
  reservationDate: ReturnType<typeof Dayjs>,
): void => {
  if (!reservationDate.isValid()) {
    throwErrorHelper("ERROR.RESERVATION.INVALID_DATE", 400);
  }

  const now = Dayjs().tz();

  if (reservationDate.isBefore(now)) {
    throwErrorHelper("ERROR.RESERVATION.INVALID_PAST_DATE", 400);
  }

  if (
    reservationDate.minute() % 5 !== 0 ||
    reservationDate.second() !== 0 ||
    reservationDate.millisecond() !== 0
  ) {
    throwErrorHelper("ERROR.RESERVATION.INVALID_SLOT_INTERVAL", 400);
  }
};

const extractValidationResults = (
  validationData: Awaited<ReturnType<typeof getValidationData>>,
) => {
  const [
    existingReservations,
    barbershopSchedule,
    targetService,
    employee,
    barbershop,
  ] = validationData;

  return {
    existingReservations,
    barbershopSchedule,
    targetService,
    employee,
    barbershop,
  };
};

const getEmployeeId = (
  employee: ReturnType<typeof extractValidationResults>["employee"],
): number => (employee as { employee_id?: number } | null)?.employee_id ?? 0;

const validateDatabaseEntities = ({
  employee,
  targetService,
  barbershop,
  barbershopSchedule,
}: ReturnType<typeof extractValidationResults>): void => {
  if (!barbershop) {
    throwErrorHelper("ERROR.BARBERSHOP.NOT_FOUND", 404);
  }
  if (!employee) {
    throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND", 404);
  }
  if (!targetService) {
    throwErrorHelper("ERROR.SERVICE.NOT_FOUND", 404);
  }
  if (!barbershopSchedule) {
    throwErrorHelper("ERROR.BARBERSHOP.CLOSED_DAY", 400);
  }
};

const buildReservationMetrics = (
  reservationDate: ReturnType<typeof Dayjs>,
  barbershopSchedule: ReturnType<
    typeof extractValidationResults
  >["barbershopSchedule"],
  targetService: ReturnType<typeof extractValidationResults>["targetService"],
) => {
  const openTime =
    (barbershopSchedule?.getDataValue("schedule_open_time") as
      | string
      | undefined) ?? "";
  const closeTime =
    (barbershopSchedule?.getDataValue("schedule_close_time") as
      | string
      | undefined) ?? "";
  const serviceDuration =
    (targetService?.getDataValue("sxb_service_duration") as
      | string
      | undefined) ?? "00:00";

  const totalJourneySlots = calculateJourneySlots(openTime, closeTime);
  const occupiedSlots = calculateServiceSlots(serviceDuration);
  const startSlot = calculateStartSlot(reservationDate, openTime);

  return {
    totalJourneySlots,
    occupiedSlots,
    startSlot,
    endSlot: startSlot + occupiedSlots,
  };
};

const calculateJourneySlots = (openTime: string, closeTime: string): number => {
  const open = Dayjs.tz(openTime.substring(0, 5), "HH:mm");
  const close = Dayjs.tz(closeTime.substring(0, 5), "HH:mm");
  return close.diff(open, "minute") / 5;
};

const calculateServiceSlots = (duration: string): number => {
  const [hours, minutes] = duration.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes % 5 !== 0) {
    throwErrorHelper("ERROR.SERVICE.INVALID_DURATION", 500);
  }
  return totalMinutes / 5;
};

const calculateStartSlot = (reservationDate: any, openTime: string): number => {
  const reservationMinutes =
    reservationDate.hour() * 60 + reservationDate.minute();
  const [openHour, openMinute] = openTime
    .substring(0, 5)
    .split(":")
    .map(Number);
  const openMinutes = openHour * 60 + openMinute;

  return (reservationMinutes - openMinutes) / 5;
};

const validateSlotBounds = (
  startSlot: number,
  endSlot: number,
  totalJourneySlots: number,
): void => {
  if (startSlot < 0) {
    throwErrorHelper("ERROR.RESERVATION.BEFORE_OPENING", 400);
  }
  if (endSlot > totalJourneySlots) {
    throwErrorHelper("ERROR.RESERVATION.OUT_OF_SCHEDULE_LIMITS", 400);
  }
};

const filterEmployeeReservations = (
  reservations: any[],
  employeeId: number,
) => {
  return reservations.filter(
    (reservation) =>
      reservation.getDataValue("reservation_employee") === employeeId,
  );
};

const checkOverlapConflict = (
  reservations: any[],
  requestedStart: number,
  requestedEnd: number,
): boolean =>
  reservations.some((reservation) => {
    const existingStart = reservation.getDataValue(
      "reservation_start_slot",
    ) as number;
    const existingOccupied = reservation.getDataValue(
      "reservation_occupied_slots",
    ) as number;
    const existingEnd = existingStart + existingOccupied;

    return requestedStart < existingEnd && requestedEnd > existingStart;
  });

const createReservationTransaction = async ({
  clientUuid,
  employeeId,
  reservationData,
  startSlot,
  occupiedSlots,
}: {
  clientUuid: string;
  employeeId: number;
  reservationData: ICreateReservationData;
  startSlot: number;
  occupiedSlots: number;
}) => {
  const transaction = await db_pool.transaction();

  try {
    const newReservation = await createReservation(
      {
        reservation_client: clientUuid,
        reservation_employee: employeeId,
        reservation_service: reservationData.reservation_service,
        reservation_barbershop: reservationData.reservation_barbershop,
        reservation_datetime: reservationData.reservation_datetime,
        reservation_start_slot: startSlot,
        reservation_occupied_slots: occupiedSlots,
      },
      transaction,
    );

    await transaction.commit();
    return newReservation;
  } catch (error) {
    await transaction.rollback();
    throwErrorHelper("ERROR.RESERVATION.UNKNOWN_ERROR", 500);
  }
};
