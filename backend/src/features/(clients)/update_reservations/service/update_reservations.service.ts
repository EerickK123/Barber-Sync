import Dayjs from "../../../../global/lib/dayjs";
import { db_pool } from "../../../../global/db/config/db-config";
import { throwErrorHelper } from "../../../../global/helpers";
import {
  IUpdateReservationData,
  IUpdateTargets,
  IDBUpdatePayload,
} from "../types/update_reservations.types";
import {
  getExistingReservationModel,
  getValidationDataForUpdate,
  validateEmployeeServiceUpdate,
  updateReservationModel,
} from "../model/update_reservations.model";

const SLOT_INTERVAL_MINUTES = 5;

// ── ORQUESTADOR PRINCIPAL ─────────────────────────────────────────────────────

export const updateReservationService = async (
  clientUuid: string,
  data: IUpdateReservationData,
) => {
  const { reservation_id, ...updateFields } = data;

  const existingReservation = await getExistingReservationModel(
    reservation_id,
    clientUuid,
  );

  if (!existingReservation) {
    throwErrorHelper("ERROR.RESERVATION.NOT_FOUND_OR_UNAUTHORIZED", 404);
  }

  const dbPayload: IDBUpdatePayload = {};
  if (updateFields.reservation_status !== undefined) {
    dbPayload.reservation_status = updateFields.reservation_status;
  }

  const requiresRescheduling =
    updateFields.reservation_datetime ||
    updateFields.reservation_employee ||
    updateFields.reservation_service;

  if (requiresRescheduling) {
    const targets = resolveUpdateTargets(existingReservation, data);

    const schedulingPayload = await processRescheduling(targets);
    Object.assign(dbPayload, schedulingPayload);
  }

  if (Object.keys(dbPayload).length === 0) {
    throwErrorHelper("ERROR.RESERVATION.NO_DATA_PROVIDED", 400);
  }

  return await executeUpdateTransaction(reservation_id, dbPayload);
};

// ── FUNCIONES AUXILIARES DE ORQUESTACIÓN ──────────────────────────────────────

const resolveUpdateTargets = (
  existingReservation: any,
  updates: IUpdateReservationData,
): IUpdateTargets => {
  const plainReservation = existingReservation.get({ plain: true });

  const barbershop_id =
    updates.reservation_barbershop ?? plainReservation.reservation_barbershop;
  const service_id =
    updates.reservation_service ?? plainReservation.reservation_service;
  const employee_uuid =
    updates.reservation_employee ?? plainReservation.Employee?.User?.uuid;

  let dateObj: Dayjs.Dayjs;

  // 💡 PUNTO CRÍTICO: Normalizamos el origen de la fecha a un objeto Dayjs local de Bogotá
  if (updates.reservation_datetime) {
    // Si viene del cliente, viene en hora local ("YYYY-MM-DD HH:mm")
    dateObj = Dayjs.tz(updates.reservation_datetime, "YYYY-MM-DD HH:mm");
    validateIncomingDate(dateObj);
  } else {
    // Si no se altera, viene de la BD como un string puro en UTC (gracias a dateStrings: true)
    // Lo leemos como UTC y lo desplazamos matemáticamente a la hora de Bogotá
    dateObj = Dayjs.utc(plainReservation.reservation_datetime as string).tz();
  }

  return {
    reservation_id: updates.reservation_id,
    barbershop_id,
    service_id,
    employee_uuid,
    datetime_str: dateObj.format("YYYY-MM-DD HH:mm"), // Guardamos siempre el formato local para cálculos de slots
    day_of_week: dateObj.day(), // Obtiene el día de la semana correcto en Colombia
    date_only: dateObj.format("YYYY-MM-DD"), // Evita saltos de día por desfase de zona horaria
  };
};

const processRescheduling = async (
  targets: IUpdateTargets,
): Promise<IDBUpdatePayload> => {
  const {
    reservation_id,
    barbershop_id,
    employee_uuid,
    service_id,
    day_of_week,
    date_only,
    datetime_str,
  } = targets;

  // Modificado: Ahora pasamos únicamente el string limpio 'date_only' ("YYYY-MM-DD")
  const [
    existingReservations,
    barbershopSchedule,
    targetService,
    employee,
    barbershop,
  ] = await getValidationDataForUpdate(
    barbershop_id,
    employee_uuid,
    service_id,
    day_of_week,
    date_only, // 👈 Firma simplificada y segura
  );

  validateDatabaseEntities({
    employee,
    targetService,
    barbershop,
    barbershopSchedule,
  });

  const employeeId = (employee as any).getDataValue("employee_id") as number;

  const employeeService = await validateEmployeeServiceUpdate(
    employeeId,
    service_id,
  );
  if (!employeeService) {
    throwErrorHelper("ERROR.EMPLOYEE.SERVICE_NOT_AVAILABLE", 400);
  }

  const openTime = barbershopSchedule!.getDataValue(
    "schedule_open_time",
  ) as string;
  const closeTime = barbershopSchedule!.getDataValue(
    "schedule_close_time",
  ) as string;
  const serviceDuration = targetService!.getDataValue(
    "sxb_service_duration",
  ) as string;

  const totalJourneySlots = calculateJourneySlots(openTime, closeTime);
  const occupiedSlots = calculateServiceSlots(serviceDuration);
  
  // Corregido: Forzamos el parseo seguro en la zona horaria local
  const startSlot = calculateStartSlot(
    Dayjs.tz(datetime_str, "YYYY-MM-DD HH:mm"),
    openTime,
  );
  const endSlot = startSlot + occupiedSlots;

  validateSlotsLimits(startSlot, endSlot, totalJourneySlots);

  const employeeReservations = filterEmployeeReservations(
    existingReservations,
    employeeId,
    reservation_id,
  );
  if (checkOverlapConflict(employeeReservations, startSlot, endSlot)) {
    throwErrorHelper("ERROR.RESERVATION.TIME_SLOT_OVERLAP", 409);
  }

  return {
    // 💡 CORREGIDO: Convertimos la fecha local calculada de Bogotá a un formato UTC limpio para la BD
    reservation_datetime: Dayjs.tz(datetime_str, "YYYY-MM-DD HH:mm").utc().format("YYYY-MM-DD HH:mm:ss"),
    reservation_barbershop: barbershop_id,
    reservation_service: service_id,
    reservation_employee: employeeId,
    reservation_start_slot: startSlot,
    reservation_occupied_slots: occupiedSlots,
  };
};

const executeUpdateTransaction = async (
  reservation_id: number,
  payload: IDBUpdatePayload,
) => {
  const transaction = await db_pool.transaction();
  try {
    const isUpdated = await updateReservationModel(
      reservation_id,
      payload,
      transaction,
    );
    await transaction.commit();
    return isUpdated;
  } catch (error) {
    await transaction.rollback();
    throwErrorHelper("ERROR.RESERVATION.UPDATE_FAILED", 500);
  }
};

const validateIncomingDate = (reservationDate: any): void => {
  if (!reservationDate.isValid())
    throwErrorHelper("ERROR.RESERVATION.INVALID_DATE", 400);
  
  // Corregido: Compara contra el 'ahora' real en Bogotá
  if (reservationDate.isBefore(Dayjs.tz()))
    throwErrorHelper("ERROR.RESERVATION.INVALID_PAST_DATE", 400);
    
  if (reservationDate.minute() % SLOT_INTERVAL_MINUTES !== 0)
    throwErrorHelper("ERROR.RESERVATION.INVALID_SLOT_INTERVAL", 400);
};

const validateDatabaseEntities = ({
  employee,
  targetService,
  barbershop,
  barbershopSchedule,
}: any): void => {
  if (!barbershop) throwErrorHelper("ERROR.BARBERSHOP.NOT_FOUND", 404);
  if (!employee) throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND", 404);
  if (!targetService) throwErrorHelper("ERROR.SERVICE.NOT_FOUND", 404);
  if (!barbershopSchedule) throwErrorHelper("ERROR.BARBERSHOP.CLOSED_DAY", 400);
};

// ── CÁLCULOS DE SLOTS ─────────────────────────────────────────────────────────

const calculateJourneySlots = (openTime: string, closeTime: string): number => {
  const open = Dayjs.tz(openTime.substring(0, 5), "HH:mm");
  const close = Dayjs.tz(closeTime.substring(0, 5), "HH:mm");
  return close.diff(open, "minute") / SLOT_INTERVAL_MINUTES;
};

const calculateServiceSlots = (duration: string): number => {
  const [hours, minutes] = duration.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes % SLOT_INTERVAL_MINUTES !== 0)
    throwErrorHelper("ERROR.SERVICE.INVALID_DURATION", 500);
  return totalMinutes / SLOT_INTERVAL_MINUTES;
};

const calculateStartSlot = (reservationDate: any, openTime: string): number => {
  const reservationMinutes =
    reservationDate.hour() * 60 + reservationDate.minute();
  const [openHour, openMinute] = openTime
    .substring(0, 5)
    .split(":")
    .map(Number);
  return (reservationMinutes - (openHour * 60 + openMinute)) / SLOT_INTERVAL_MINUTES;
};

const validateSlotsLimits = (
  startSlot: number,
  endSlot: number,
  totalJourneySlots: number,
): void => {
  if (startSlot < 0) throwErrorHelper("ERROR.RESERVATION.BEFORE_OPENING", 400);
  if (endSlot > totalJourneySlots)
    throwErrorHelper("ERROR.RESERVATION.OUT_OF_SCHEDULE_LIMITS", 400);
};

// ── LÓGICA DE SOLAPAMIENTO ────────────────────────────────────────────────────

const filterEmployeeReservations = (
  reservations: any[],
  employeeId: number,
  currentReservationId: number,
) =>
  reservations.filter(
    (r) =>
      r.getDataValue("reservation_employee") === employeeId &&
      r.getDataValue("reservation_id") !== currentReservationId,
  );

const checkOverlapConflict = (
  reservations: any[],
  requestedStart: number,
  requestedEnd: number,
): boolean =>
  reservations.some((r) => {
    const existingStart = r.getDataValue("reservation_start_slot") as number;
    const existingEnd =
      existingStart + (r.getDataValue("reservation_occupied_slots") as number);
    return requestedStart < existingEnd && requestedEnd > existingStart;
  });